import streamlit as st
import boto3
import json
from PIL import Image
import io
import base64
import time

st.set_page_config(layout="wide")

# Updated MODELS dictionary with all 4 models
MODELS = {
    "Claude 3 Sonnet": {
        "id": "anthropic.claude-3-sonnet-20240229-v1:0",
        "type": "text",
        "provider": "anthropic",
        "max_tokens": 200,
        "temperature": 1,
        "top_p": 0.999,
        "top_k": 250
    },
    "Llama 3 70B": {
        "id": "meta.llama3-70b-instruct-v1:0",
        "type": "text",
        "provider": "meta",
        "max_tokens": 4096,
        "temperature": 0.5,
        "top_p": 0.9
    },
    "Llama 3.2 Vision": {
        "id": "us.meta.llama3-2-90b-instruct-v1:0",
        "type": "text_and_vision",
        "provider": "meta",
        "max_tokens": 512,
        "temperature": 0.6,
        "top_p": 0.9
    },
    "Stable Diffusion XL": {
        "id": "stability.stable-diffusion-xl-v1",
        "type": "image",
        "provider": "stability",
        "steps": 50,
        "cfg_scale": 10,
        "seed": 42
    }
}

def init_bedrock_clients():
    bedrock = boto3.client(
        service_name='bedrock',
        region_name=st.secrets["aws_credentials"]["AWS_REGION"],
        aws_access_key_id=st.secrets["aws_credentials"]["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=st.secrets["aws_credentials"]["AWS_SECRET_ACCESS_KEY"]
    )
    
    bedrock_runtime = boto3.client(
        service_name='bedrock-runtime',
        region_name=st.secrets["aws_credentials"]["AWS_REGION"],
        aws_access_key_id=st.secrets["aws_credentials"]["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=st.secrets["aws_credentials"]["AWS_SECRET_ACCESS_KEY"]
    )
    
    return bedrock, bedrock_runtime

def generate_claude_response(client, prompt):
    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": MODELS["Claude 3 Sonnet"]["max_tokens"],
        "temperature": MODELS["Claude 3 Sonnet"]["temperature"],
        "top_p": MODELS["Claude 3 Sonnet"]["top_p"],
        "top_k": MODELS["Claude 3 Sonnet"]["top_k"],
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    try:
        response = client.invoke_model(
            modelId=MODELS["Claude 3 Sonnet"]["id"],
            contentType="application/json",
            accept="application/json",
            body=json.dumps(body)
        )
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
    except Exception as e:
        return f"Claude Error: {str(e)}"

def generate_llama_response(client, prompt, model_name="Llama 3 70B"):
    formatted_prompt = f"""<|begin_of_text|><|start_header_id|>user<|end_header_id|>
{prompt}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
"""

    body = {
        "prompt": formatted_prompt,
        "max_gen_len": MODELS[model_name]["max_tokens"],
        "temperature": MODELS[model_name]["temperature"],
        "top_p": MODELS[model_name]["top_p"]
    }
    
    try:
        response = client.invoke_model(
            modelId=MODELS[model_name]["id"],
            contentType="application/json",
            accept="application/json",
            body=json.dumps(body)
        )
        response_body = json.loads(response['body'].read())
        return response_body.get('generation', '')
    except Exception as e:
        return f"Llama Error: {str(e)}\nModel ID: {MODELS[model_name]['id']}"

def generate_llama_vision_response(client, prompt, image_url=None, group_label=None):
    """
    Enhanced Llama Vision response generator with fairness monitoring
    """
    body = {
        "prompt": f"{prompt}",
        "temperature": MODELS["Llama 3.2 Vision"]["temperature"],
        "top_p": MODELS["Llama 3.2 Vision"]["top_p"]
    }
    
    if image_url:
        body["image"] = {
            "url": image_url
        }
    
    try:
        # Initialize fairness metrics if needed
        if group_label:
            if 'fairness_metrics' not in st.session_state:
                st.session_state.fairness_metrics = {}
            if group_label not in st.session_state.fairness_metrics:
                st.session_state.fairness_metrics[group_label] = {
                    'requests': 0,
                    'successful_responses': 0,
                    'failed_responses': 0,
                    'response_times': []
                }
        
        start_time = time.time()
        
        response = client.invoke_model(
            modelId=MODELS["Llama 3.2 Vision"]["id"],
            contentType="application/json",
            accept="application/json",
            body=json.dumps(body)
        )
        
        response_time = time.time() - start_time
        response_body = json.loads(response['body'].read())
        
        # Update metrics on success
        if group_label:
            metrics = st.session_state.fairness_metrics[group_label]
            metrics['requests'] += 1
            metrics['successful_responses'] += 1
            metrics['response_times'].append(response_time)
        
        return response_body.get('generation', '')
        
    except Exception as e:
        # Update metrics on failure
        if group_label:
            st.session_state.fairness_metrics[group_label]['requests'] += 1
            st.session_state.fairness_metrics[group_label]['failed_responses'] += 1
        
        error_msg = f"Llama Vision Error: {str(e)}\nModel ID: {MODELS['Llama 3.2 Vision']['id']}\nRequest Body: {json.dumps(body, indent=2)}"
        return error_msg

def display_fairness_metrics():
    """Display fairness metrics in the Streamlit sidebar"""
    st.sidebar.markdown("### Fairness Metrics")
    
    metrics = st.session_state.fairness_metrics
    for group in metrics:
        st.sidebar.markdown(f"#### Group: {group}")
        group_metrics = metrics[group]
        
        # Calculate success rate
        total_requests = group_metrics['requests']
        success_rate = (group_metrics['successful_responses'] / total_requests * 100 
                       if total_requests > 0 else 0)
        
        # Calculate average response time
        avg_response_time = (sum(group_metrics['response_times']) / len(group_metrics['response_times'])
                           if group_metrics['response_times'] else 0)
        
        # Display metrics
        st.sidebar.metric("Success Rate", f"{success_rate:.1f}%")
        st.sidebar.metric("Avg Response Time", f"{avg_response_time:.2f}s")
        st.sidebar.metric("Total Requests", total_requests)

def generate_image(client, prompt, settings):
    body = {
        "text_prompts": [
            {
                "text": prompt,
                "weight": 1.0
            }
        ],
        "cfg_scale": settings["cfg_scale"],
        "seed": settings["seed"],
        "steps": settings["steps"],
        "style_preset": "photographic",
        "width": 1024,
        "height": 1024
    }
    
    try:
        response = client.invoke_model(
            modelId=MODELS["Stable Diffusion XL"]["id"],
            contentType="application/json",
            accept="application/json",
            body=json.dumps(body)
        )
        response_body = json.loads(response['body'].read())
        image_data = base64.b64decode(response_body['artifacts'][0]['base64'])
        return Image.open(io.BytesIO(image_data))
    except Exception as e:
        return f"Image Generation Error: {str(e)}"

def list_available_models(bedrock_client):
    try:
        response = bedrock_client.list_foundation_models()
        st.write("Available Meta models:")
        for model in response['modelSummaries']:
            if 'meta' in model['modelId']:
                st.write(f"- {model['modelId']}")
                st.write(f"  Status: {model.get('modelLifecycle', {}).get('status', 'Unknown')}")
    except Exception as e:
        st.error(f"Error listing models: {str(e)}")

def show_fairness_insights():
    """Display detailed fairness insights and analysis"""
    st.markdown("### Fairness Insights")
    
    if 'fairness_metrics' not in st.session_state:
        st.info("No fairness data collected yet.")
        return
    
    metrics = st.session_state.fairness_metrics
    
    # Calculate overall statistics
    total_groups = len(metrics)
    if total_groups < 2:
        st.warning("Need at least 2 groups for fairness comparison.")
        return
    
    # Create comparison metrics
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Success Rates")
        success_rates = {}
        for group in metrics:
            total = metrics[group]['requests']
            success = metrics[group]['successful_responses']
            rate = (success / total * 100) if total > 0 else 0
            success_rates[group] = rate
            st.metric(f"{group}", f"{rate:.1f}%")
        
        # Calculate disparity
        max_rate = max(success_rates.values())
        min_rate = min(success_rates.values())
        disparity = max_rate - min_rate
        st.metric("Success Rate Disparity", f"{disparity:.1f}%")
    
    with col2:
        st.markdown("#### Response Times")
        avg_times = {}
        for group in metrics:
            times = metrics[group]['response_times']
            avg = sum(times) / len(times) if times else 0
            avg_times[group] = avg
            st.metric(f"{group}", f"{avg:.2f}s")
        
        # Calculate time disparity
        max_time = max(avg_times.values())
        min_time = min(avg_times.values())
        time_disparity = max_time - min_time
        st.metric("Response Time Disparity", f"{time_disparity:.2f}s")
    
    # Show recommendations
    st.markdown("#### Recommendations")
    if disparity > 10:  # More than 10% success rate disparity
        st.warning("⚠️ High success rate disparity detected between groups")
    if time_disparity > 1:  # More than 1 second time disparity
        st.warning("⚠️ Significant response time disparity between groups")
    
    # Show raw data option
    if st.checkbox("Show Raw Metrics"):
        st.json(metrics)

def main():
    st.title("🤖 AWS Bedrock AI Generator")
    
    try:
        bedrock, bedrock_runtime = init_bedrock_clients()
    except Exception as e:
        st.error(f"AWS Configuration Error: {str(e)}")
        return

    # Model selection
    selected_model = st.selectbox(
        "Choose your model:",
        options=list(MODELS.keys())
    )

    # Model info display
    st.markdown(f"**Model**: {selected_model}")
    st.markdown(f"**Provider**: {MODELS[selected_model]['provider'].capitalize()}")
    st.markdown(f"**Type**: {MODELS[selected_model]['type'].capitalize()}")

    # Initialize settings with default values from MODELS dictionary
    settings = {}
    
    # Advanced settings
    with st.expander("Advanced Settings"):
        if selected_model in ["Claude 3 Sonnet", "Llama 3 70B", "Llama 3.2 Vision"]:
            settings["temperature"] = st.slider(
                "Temperature",
                min_value=0.0,
                max_value=1.0,
                value=float(MODELS[selected_model]["temperature"]),
                step=0.1
            )
            settings["max_tokens"] = st.slider(
                "Max Tokens",
                min_value=100,
                max_value=4096,
                value=int(MODELS[selected_model]["max_tokens"]),
                step=1
            )
        elif selected_model == "Stable Diffusion XL":
            settings["steps"] = st.slider(
                "Steps",
                min_value=10,
                max_value=100,
                value=int(MODELS[selected_model]["steps"]),
                step=1
            )
            settings["cfg_scale"] = st.slider(
                "CFG Scale",
                min_value=1.0,
                max_value=20.0,
                value=float(MODELS[selected_model]["cfg_scale"]),
                step=0.5
            )
            settings["seed"] = st.number_input(
                "Seed",
                value=int(MODELS[selected_model]["seed"]),
                step=1
            )

    # Image upload for Llama Vision model
    image_url = None
    if selected_model == "Llama 3.2 Vision":
        st.write("Optional: Upload an image for vision analysis")
        uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
        if uploaded_file is not None:
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Image", use_column_width=True)
            # TODO: Implement image URL generation if needed
            # image_url = upload_to_s3_and_get_url(uploaded_file)

    # Input area
    prompt_placeholder = "Describe the image you want to generate..." if selected_model == "Stable Diffusion XL" else "Enter your prompt..."
    prompt = st.text_area(
        "Enter your prompt:",
        height=100,
        placeholder=prompt_placeholder
    )

    # Add group selection for fairness monitoring
    group_label = None
    if st.checkbox("Enable Fairness Monitoring"):
        group_label = st.selectbox(
            "Select Group",
            options=["Group A", "Group B", "Group C"],
            help="Select demographic group for fairness monitoring"
        )
    
    if st.button("Generate"):
        if not prompt:
            st.warning("Please enter a prompt.")
            return

        with st.spinner(f"Generating with {selected_model}..."):
            if selected_model == "Claude 3 Sonnet":
                response = generate_claude_response(bedrock_runtime, prompt)
                st.markdown(response)
            elif selected_model == "Llama 3.2 Vision":
                response = generate_llama_vision_response(
                    bedrock_runtime, 
                    prompt, 
                    image_url,
                    group_label
                )
                st.markdown(response)
                
                # Show fairness insights if monitoring is enabled
                if group_label and st.checkbox("Show Fairness Insights"):
                    show_fairness_insights()
            elif selected_model == "Llama 3 70B":
                response = generate_llama_response(bedrock_runtime, prompt, selected_model)
                st.markdown(response)
            else:  # Stable Diffusion XL
                response = generate_image(bedrock_runtime, prompt, settings)
                if isinstance(response, Image.Image):
                    st.image(response, caption="Generated Image")
                else:
                    st.error(response)

if __name__ == "__main__":
    main()