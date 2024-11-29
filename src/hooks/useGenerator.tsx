import axios from "axios";
import { useState } from "react";


/*
marketting plan:
{
        goals: '',
        artist_name: '',
        genre: '',
        target_audience: '',
        additional_information: '',
        assets: '',
        budget: '',
        channels: '',
        timeline: ''
    }

*/ 

interface DynamicObject {
    [key: string]: string; // All properties must be strings
  }

export const useGenerator = ({formData, endpoint}: {formData: DynamicObject, endpoint: string}) => {

    const [isDone, setIsDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState("");
    const [prompt, setPrompt] = useState(formData);


    const handleInputChange = e => {
        setPrompt(prevPrompt => ({
            ...prevPrompt,
            [e.target.id]: e.target.value
        }));
    };

    // const handleSubmitted = async () => {
    //     setLoading(true);
    //     setError("");
    //     axios.post("http://localhost:3001/api/generate-a-marketing-plan", prompt).then(res => {
    //         console.log(res.data);
    //         setLoading(false);
    //     }).catch(err => {
    //         console.log('Error Submitting data: ', err);
    //         setLoading(false);
    //     });
    // };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
                body: JSON.stringify(prompt),
                method: 'POST'
            });

            if (response.ok) {
                setLoading(false);
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let done = false;
                while (!done) {
                    const { value, done: streamDone } = await reader?.read();
                    done = streamDone;
                    if (value) {
                        setData((prevData) => prevData + decoder.decode(value)); // Append new chunks
                    }
                }
            }
        } catch (err) {
            console.log('The error is: ', err);
        }
    }

    return {
        handleSubmit,
        handleInputChange,
        data,
        loading,
        error,
        prompt
    }
};