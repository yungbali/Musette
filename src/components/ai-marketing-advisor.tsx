import { useState } from 'react'
import { Button } from "./ui/button"
import AiMarketingAdvisorForm from './ai-marketing-advisor-form'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import MarkDownDisplay from './react-markdown'
import { BASEURL } from '../util/baseUrl'



interface PropsData {
  data: string;
  error: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSlectInputChange: (value: string)=> void;
  handleSubmit: () => Promise<void>;
  loading: boolean;
  prompt: {
    band_name: string;
    genre: string;
    target_audience: string;
    current_followers: string;
    streams: string;
    budget: string;
    advice: string;
  }
}



// function AlertDialogDemo({ children, onClick, loading }: { children: ReactNode, onClick: () => void, loading: boolean }) {
function AlertDialogDemo({ loading, data, error, handleSlectInputChange, handleInputChange, handleSubmit, prompt }: PropsData) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center justify-end" asChild>
        <div className='flex items-center justify-end'>
          <Button variant="outline" onClick={() => {

          }}>Generate New Market Plan</Button>
        </div>
      </AlertDialogTrigger>
      {<AlertDialogContent>
        <AiMarketingAdvisorForm
          handleSubmit={handleSubmit}
          prompt={prompt}
          data={data}
          error={error}
          loading={loading}
          handleInputChange={handleInputChange}
          handleSlectInputChange={handleSlectInputChange}
        />
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogContent>}
    </AlertDialog>
  )
}


const useAiMarketingAdvisor = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const [prompt, setPrompt] = useState({
    band_name: '',
    genre: '',
    target_audience: '',
    current_followers: '',
    streams: '',
    budget: '',
    advice: '',

    // industry: '',
    // goals: '',
    // usp: '',
    // marketing_channels: '',
    // competitors: '',
    // timeframe: '',
    // brand_voice: '',
    // products_services: '',
    // region: ''
  });


  // const [conversation, setConversation] = useState([])
  // const [userInput, setUserInput] = useState('')


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPrompt(prevPrompt => ({
      ...prevPrompt,
      [e.target.id]: e.target.value
    }));
  };

  const handleSlectInputChange = (value: string) => {
    setPrompt({
      ...prompt,
      target_audience: value
    });
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASEURL}/generate-marketing-advice`, {
        body: JSON.stringify(prompt),
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("musette-jwt")}`
        }
      });

      if (response.ok) {
        setLoading(false);
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          if (reader) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;
            if (value) {
              setData((prevData) => prevData + decoder.decode(value)); // Append new chunks
            }
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
    handleSlectInputChange,
    data,
    loading,
    error,
    prompt
  }
}

export function AIMarketingAdvisor() {

  // const [conversation, setConversation] = useState([])
  // const [userInput, setUserInput] = useState('')


  // const handleSendMessage = () => {
  //   if (userInput.trim()) {
  //     setConversation([...conversation, { type: 'user', message: userInput }])
  //     // Simulated AI response
  //     setTimeout(() => {
  //       setConversation(prev => [...prev, { type: 'ai', message: "Thank you for your input. I'm analyzing your data and will provide personalized marketing insights shortly." }])
  //     }, 1000)
  //     setUserInput('')
  //   }
  // }

  const { data, prompt, error, handleInputChange, handleSlectInputChange, handleSubmit, loading } = useAiMarketingAdvisor();


  const uiToShow = data ? 1 : 0;
  if (uiToShow === 0) {
    return (
      <AiMarketingAdvisorForm
        handleSubmit={handleSubmit}
        prompt={prompt}
        data={data}
        error={error}
        loading={loading}
        handleInputChange={handleInputChange}
        handleSlectInputChange={handleSlectInputChange}
      />
    );
  }

  return (
    <>
      <AlertDialogDemo
      handleSlectInputChange={handleSlectInputChange}
        prompt={prompt}
        data={data}
        error={error}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <MarkDownDisplay
        text={data}
        title='Generate Marketing Advice'
        btnText='Download Advice'
        key={data}
      />
    </>
  );

}