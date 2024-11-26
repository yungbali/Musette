import streamlit as st
import boto3
import json
from PIL import Image
import io
import base64

# Update the MODELS configuration to reflect our specialized tools
TOOLS = {
    "EPK Generator": {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "type": "text",
        "provider": "anthropic",
        "temperature": 0.7,
        "top_p": 0.99,
        "description": "Generate professional Electronic Press Kits for artists",
        "icon": "📋"
    },
    "Album Art Creator": {
        "model": "stability.stable-diffusion-xl-v1",
        "type": "image",
        "provider": "stability",
        "steps": 50,
        "cfg_scale": 10,
        "seed": 42,
        "description": "Create stunning album artwork using AI",
        "icon": "🎨"
    },
    "Marketing Copy Generator": {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "type": "text",
        "provider": "anthropic",
        "temperature": 0.8,
        "top_p": 0.99,
        "description": "Generate engaging marketing copy for music releases",
        "icon": "✍️"
    },
    "Marketing Advisor": {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "type": "text",
        "provider": "anthropic",
        "temperature": 0.7,
        "top_p": 0.99,
        "description": "Get strategic marketing advice for your music",
        "icon": "💡"
    }
}

def init_aws_clients():
    """Initialize AWS clients"""
    try:
        bedrock = boto3.client(
            service_name='bedrock-runtime',
            region_name=st.secrets["aws_credentials"]["AWS_REGION"],
            aws_access_key_id=st.secrets["aws_credentials"]["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=st.secrets["aws_credentials"]["AWS_SECRET_ACCESS_KEY"]
        )
        return {'bedrock': bedrock}
    except Exception as e:
        st.error(f"Failed to initialize AWS services: {str(e)}")
        return None

def handle_epk_generation(bedrock, tool_config):
    """Handle EPK generation"""
    st.markdown("""
        ## 📋 Electronic Press Kit Generator
        Create a professional EPK for your music project.
        
        ---
    """)
    
    # Input fields for EPK
    artist_name = st.text_input("Artist Name", label_visibility="visible")
    genre = st.text_input("Genre", label_visibility="visible")
    bio = st.text_area("Artist Bio", height=150, help="Share your story, influences, and achievements")
    achievements = st.text_area("Notable Achievements", height=100, help="Awards, performances, collaborations, etc.")
    
    if st.button("Generate EPK", type="primary"):
        if not all([artist_name, genre, bio]):
            st.warning("Please fill in all required fields.")
            return
            
        prompt = f"""Create a professional Electronic Press Kit for:
        Artist: {artist_name}
        Genre: {genre}
        Bio: {bio}
        Achievements: {achievements}
        
        Format the EPK with these sections:
        1. Artist Overview
        2. Biography
        3. Music Description
        4. Achievements & Press
        5. Contact Information (placeholder)
        
        Make it engaging and professional, highlighting the artist's unique qualities."""
        
        # Generate EPK using Claude
        try:
            response = generate_text(bedrock, tool_config, prompt)
            st.markdown("### 📄 Your Generated EPK")
            st.markdown(response)
            
            # Add download button
            st.download_button(
                "📥 Download EPK",
                response,
                file_name=f"{artist_name}_EPK.txt",
                mime="text/plain"
            )
        except Exception as e:
            st.error(f"Error generating EPK: {str(e)}")

def handle_album_art_creation(bedrock, tool_config):
    """Handle album art creation"""
    st.markdown("""
        ## 🎨 Album Art Creator
        Generate unique album artwork for your music (1500x1500 pixels, will be upscaled).
        
        ---
    """)
    
    # Input fields for album art
    album_title = st.text_input("Album Title", label_visibility="visible")
    style_description = st.text_area(
        "Style Description",
        height=100,
        help="Describe the visual style you want (e.g., minimalist, psychedelic, vintage)"
    )
    mood = st.selectbox(
        "Mood",
        ["Dark", "Energetic", "Peaceful", "Mysterious", "Joyful", "Melancholic"]
    )
    
    if st.button("Generate Album Art", type="primary"):
        if not all([album_title, style_description]):
            st.warning("Please fill in all required fields.")
            return
            
        prompt = f"""Create professional album cover art:
        Title: {album_title}
        Style: {style_description}
        Mood: {mood}
        
        Important requirements:
        - Square format album cover
        - High quality, professional look
        - Clear focal point
        - Suitable for both digital and print
        - No text or typography (will be added later)
        - Strong visual impact
        """
        
        try:
            body = json.dumps({
                "text_prompts": [
                    {
                        "text": prompt,
                        "weight": 1.0
                    }
                ],
                "cfg_scale": tool_config["cfg_scale"],
                "steps": tool_config["steps"],
                "seed": tool_config["seed"],
                "width": 1024,  # Standard size for SDXL
                "height": 1024,
                "samples": 1,
                "style_preset": "photographic"
            })
            
            with st.spinner("Generating album art..."):
                response = bedrock.invoke_model(
                    modelId=tool_config["model"],
                    body=body
                )
                
                response_body = json.loads(response['body'].read())
                if 'artifacts' in response_body:
                    st.markdown("### Generated Album Art")
                    for i, artifact in enumerate(response_body['artifacts']):
                        image_data = base64.b64decode(artifact['base64'])
                        image = Image.open(io.BytesIO(image_data))
                        
                        # Display original image
                        st.image(image, caption=f"Generated Album Art {i+1}", use_column_width=True)
                        
                        # Upscale to 3000x3000 using high-quality resampling
                        upscaled_image = image.resize((3000, 3000), Image.Resampling.LANCZOS)
                        
                        # Save both versions
                        original_buffered = io.BytesIO()
                        upscaled_buffered = io.BytesIO()
                        
                        image.save(original_buffered, format="PNG", quality=100)
                        upscaled_image.save(upscaled_buffered, format="PNG", quality=100)
                        
                        col1, col2 = st.columns(2)
                        
                        with col1:
                            st.download_button(
                                f"📥 Download Original (1024x1024)",
                                original_buffered.getvalue(),
                                file_name=f"{album_title}_album_art_{i+1}_1024x1024.png",
                                mime="image/png",
                                help="Download the original resolution image"
                            )
                            
                        with col2:
                            st.download_button(
                                f"📥 Download Upscaled (3000x3000)",
                                upscaled_buffered.getvalue(),
                                file_name=f"{album_title}_album_art_{i+1}_3000x3000.png",
                                mime="image/png",
                                help="Download the upscaled high-resolution image"
                            )
                        
                        st.caption(f"Original size: {image.size[0]}x{image.size[1]} pixels")
                        st.caption("Upscaled version available at 3000x3000 pixels")
                    
        except Exception as e:
            st.error(f"Error generating album art: {str(e)}")
            if 'response_body' in locals():
                with st.expander("Debug Information"):
                    st.code(json.dumps(response_body, indent=2))

def handle_marketing_copy(bedrock, tool_config):
    """Handle marketing copy generation"""
    st.markdown("""
        ## ✍️ Marketing Copy Generator
        Create compelling marketing copy for your music release.
        
        ---
    """)
    
    # Input fields for marketing copy
    release_type = st.selectbox("Release Type", ["Single", "EP", "Album"])
    release_title = st.text_input("Release Title", label_visibility="visible")
    key_points = st.text_area("Key Selling Points", height=100, help="What makes this release special?")
    target_audience = st.text_input("Target Audience", help="Who is this release for?")
    
    if st.button("Generate Marketing Copy", type="primary"):
        if not all([release_title, key_points]):
            st.warning("Please fill in all required fields.")
            return
            
        prompt = f"""Create marketing copy for:
        Type: {release_type}
        Title: {release_title}
        Key Points: {key_points}
        Target Audience: {target_audience}
        
        Generate:
        1. Short description (50 words)
        2. Long description (200 words)
        3. Social media posts (3 variations)
        4. Email newsletter copy
        
        Make it engaging and compelling for the target audience."""
        
        try:
            response = generate_text(bedrock, tool_config, prompt)
            st.markdown("### 📝 Your Marketing Copy")
            st.markdown(response)
            
            st.download_button(
                "📥 Download Copy",
                response,
                file_name=f"{release_title}_marketing_copy.txt",
                mime="text/plain"
            )
        except Exception as e:
            st.error(f"Error generating marketing copy: {str(e)}")

def handle_marketing_advisor(bedrock, tool_config):
    """Handle marketing strategy advice"""
    st.markdown("""
        ## 💡 Marketing Advisor
        Get personalized marketing strategy advice.
        
        ---
    """)
    
    # Input fields for marketing advice
    project_description = st.text_area("Project Description", height=100)
    current_following = st.text_input("Current Following (approximate numbers)", help="e.g., Instagram: 1000, Spotify: 500")
    budget = st.selectbox("Marketing Budget", ["$0-$100", "$100-$500", "$500-$1000", "$1000+"])
    goals = st.text_area("Marketing Goals", height=100, help="What do you want to achieve?")
    
    if st.button("Get Marketing Advice", type="primary"):
        if not all([project_description, goals]):
            st.warning("Please fill in all required fields.")
            return
            
        prompt = f"""Provide marketing strategy advice for:
        Project: {project_description}
        Current Following: {current_following}
        Budget: {budget}
        Goals: {goals}
        
        Include:
        1. Overall Strategy
        2. Platform-specific tactics
        3. Budget allocation suggestions
        4. Timeline recommendations
        5. Key performance indicators
        6. Potential challenges and solutions
        
        Make it practical and actionable within the given budget."""
        
        try:
            response = generate_text(bedrock, tool_config, prompt)
            st.markdown("### 📊 Your Marketing Strategy")
            st.markdown(response)
            
            st.download_button(
                "📥 Download Strategy",
                response,
                file_name="marketing_strategy.txt",
                mime="text/plain"
            )
        except Exception as e:
            st.error(f"Error generating marketing advice: {str(e)}")

def generate_text(bedrock, tool_config, prompt):
    """Helper function to generate text using the appropriate model"""
    try:
        if tool_config["provider"] == "anthropic":
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 4096,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": tool_config["temperature"],
                "top_p": tool_config["top_p"]
            })
        
        response = bedrock.invoke_model(
            modelId=tool_config["model"],
            body=body
        )
        
        response_body = json.loads(response['body'].read())
        return response_body.get('content', [{}])[0].get('text', '')
    except Exception as e:
        raise Exception(f"Error generating text: {str(e)}")

def handle_image_generation(bedrock, model_config):
    """Handle image generation models"""
    st.markdown("""
        ### Image Generation
        Enter a detailed description of the image you want to generate.
    """)
    
    user_input = st.text_area(
        "Enter your prompt:",
        height=100,
        help="Be specific about the image details you want to generate"
    )
    
    col1, col2, col3 = st.columns([1, 1, 2])
    with col1:
        if st.button("Generate Image", type="primary"):
            if not user_input:
                st.warning("Please enter a prompt.")
                return
                
            with st.spinner("Generating image..."):
                try:
                    body = json.dumps({
                        "text_prompts": [{"text": user_input}],
                        "cfg_scale": model_config["cfg_scale"],
                        "steps": model_config["steps"],
                        "seed": model_config["seed"]
                    })
                    
                    response = bedrock.invoke_model(
                        modelId=model_config["id"],
                        body=body
                    )
                    
                    response_body = json.loads(response['body'].read())
                    if 'artifacts' in response_body:
                        st.markdown("### Generated Images")
                        for i, artifact in enumerate(response_body['artifacts']):
                            image_data = base64.b64decode(artifact['base64'])
                            image = Image.open(io.BytesIO(image_data))
                            
                            # Display image
                            st.image(image, caption=f"Generated Image {i+1}")
                            
                            # Add download button
                            buffered = io.BytesIO()
                            image.save(buffered, format="PNG")
                            st.download_button(
                                f"Download Image {i+1}",
                                buffered.getvalue(),
                                file_name=f"generated_image_{i+1}.png",
                                mime="image/png"
                            )
                            
                except Exception as e:
                    st.error(f"Error generating image: {str(e)}")
                    if 'response_body' in locals():
                        with st.expander("Debug Information"):
                            st.code(json.dumps(response_body, indent=2))

def main():
    """Main application"""
    st.set_page_config(
        page_title="Musette AI Generator",
        page_icon="🎵",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Modern, clean CSS design
    st.markdown("""
        <style>
        /* Main background and container */
        .stApp {
            background: linear-gradient(135deg, #1a1a1a 0%, #ffd700 100%);
        }
        
        /* Card-like containers - updated with darker background */
        .stTextInput > div > div,
        .stTextArea > div > div,
        .stSelectbox > div > div,
        div.stMarkdown > div {
            background-color: rgba(26, 26, 26, 0.9) !important;
            border-radius: 15px !important;
            border: 1px solid rgba(255, 215, 0, 0.2) !important;
            padding: 20px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
            backdrop-filter: blur(10px) !important;
            transition: transform 0.2s, box-shadow 0.2s !important;
        }

        /* Hover effects for cards */
        .stTextInput > div > div:hover,
        .stTextArea > div > div:hover,
        .stSelectbox > div > div:hover,
        div.stMarkdown > div:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3) !important;
        }
        
        /* Typography - updated for better contrast */
        h1 {
            color: #ffd700 !important;
            font-size: clamp(2em, 5vw, 3.2em) !important;
            font-weight: 800 !important;
            margin-bottom: 1em !important;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            letter-spacing: -1px !important;
        }
        
        h2 {
            color: #ffd700 !important;
            font-size: clamp(1.5em, 4vw, 2.2em) !important;
            font-weight: 600 !important;
            margin-top: 1em !important;
            letter-spacing: -0.5px !important;
        }
        
        h3 {
            color: #ffd700 !important;
            font-size: clamp(1.2em, 3vw, 1.5em) !important;
            font-weight: 500 !important;
            margin-bottom: 0.5em !important;
        }
        
        p, label, .stTextInput input, .stTextArea textarea {
            color: #ffffff !important;
            font-size: clamp(1em, 2vw, 1.1em) !important;
            line-height: 1.6 !important;
        }
        
        /* Response container - updated */
        .response-container {
            background-color: rgba(26, 26, 26, 0.95) !important;
            border-radius: 15px !important;
            padding: 25px !important;
            margin: 15px 0 !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
            border: 1px solid rgba(255, 215, 0, 0.2) !important;
            font-size: clamp(14px, 2vw, 16px) !important;
            line-height: 1.6 !important;
            color: #ffffff !important;
        }
        
        /* Input fields - updated */
        .stTextInput input, .stTextArea textarea {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 215, 0, 0.2) !important;
            color: #ffffff !important;
        }

        /* Selectbox - updated */
        .stSelectbox > div > div {
            background-color: rgba(26, 26, 26, 0.9) !important;
            color: #ffffff !important;
        }

        .stSelectbox > div > div > div {
            color: #ffffff !important;
        }
        
        /* Button styling - updated */
        .stButton > button {
            background-color: #ffd700 !important;
            color: #1a1a1a !important;
            border-radius: 12px !important;
            padding: 10px 25px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2) !important;
            border: none !important;
        }
        
        .stButton > button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3) !important;
            background-color: #ffe44d !important;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            .stButton > button {
                width: 100% !important;
                padding: 15px !important;
            }
            
            .response-container {
                padding: 15px !important;
            }
        }
        
        /* Animations - enhanced */
        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        .stMarkdown {
            animation: fadeIn 0.6s ease-out;
        }
        
        /* Model Selection Dropdown - updated */
        .stSelectbox > div {
            background-color: rgba(26, 26, 26, 0.9) !important;
            border-radius: 15px !important;
            border: 1px solid rgba(255, 215, 0, 0.2) !important;
            padding: 5px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
        }

        /* Dropdown text and arrow */
        .stSelectbox > div > div > div {
            color: #ffffff !important;
            font-weight: 500 !important;
        }

        /* Dropdown options when expanded */
        .stSelectbox > div > div > div[data-baseweb="select"] > div {
            background-color: rgba(26, 26, 26, 0.95) !important;
            border: 1px solid rgba(255, 215, 0, 0.2) !important;
        }

        /* Dropdown option hover state */
        .stSelectbox > div > div > div[data-baseweb="select"] > div:hover {
            background-color: rgba(255, 215, 0, 0.1) !important;
        }

        /* Label for select box */
        .stSelectbox label {
            color: #ffd700 !important;
            font-size: 1.1em !important;
            font-weight: 500 !important;
            margin-bottom: 8px !important;
        }
        </style>
    """, unsafe_allow_html=True)

    # App Header with subtle animation
    st.markdown("""
        <h1 style='text-align: center; animation: fadeIn 0.8s ease-out;'>
            🎵 Musette AI Generator
        </h1>
    """, unsafe_allow_html=True)
    
    # Initialize AWS clients
    aws_clients = init_aws_clients()
    if not aws_clients:
        return
    
    bedrock = aws_clients['bedrock']
    
    # Tool selection
    selected_tool = st.selectbox(
        "🛠️ Select Tool",
        options=list(TOOLS.keys()),
        format_func=lambda x: f"{TOOLS[x]['icon']} {x} - {TOOLS[x]['description']}",
        help="Choose the tool you want to use"
    )
    
    tool_config = TOOLS[selected_tool]
    
    # Route to appropriate handler
    if selected_tool == "EPK Generator":
        handle_epk_generation(bedrock, tool_config)
    elif selected_tool == "Album Art Creator":
        handle_album_art_creation(bedrock, tool_config)
    elif selected_tool == "Marketing Copy Generator":
        handle_marketing_copy(bedrock, tool_config)
    elif selected_tool == "Marketing Advisor":
        handle_marketing_advisor(bedrock, tool_config)

if __name__ == "__main__":
    main()