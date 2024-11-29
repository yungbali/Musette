import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import axios from 'axios'
import AiMarketingAdvisorForm from './ai-marketing-advisor-form'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import MarkDownDisplay from './react-markdown'
import { BASEURL } from '../util/baseUrl'



interface PropsData {
  data: string;
  error: string;
  handleInputChange: (e: React.ChangeEventHandler) => void;
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
function AlertDialogDemo({ loading, data, error, handleInputChange, handleSubmit, prompt }: PropsData) {
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
        />
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogContent>}
    </AlertDialog>
  )
}


const useAiMarketingAdvisor = () => {

  const [isDone, setIsDone] = useState(false);
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


  const [conversation, setConversation] = useState([])
  const [userInput, setUserInput] = useState('')


  const handleInputChange = e => {
    setPrompt(prevPrompt => ({
      ...prevPrompt,
      [e.target.id]: e.target.value
    }));
  };



  // const handleSubmitted = async () => {
  //   setLoading(true);
  //   setError("");
  //   axios.post("http://localhost:3001/api/generate-a-marketing-plan", prompt).then(res => {
  //     console.log(res.data);
  //     setLoading(false);
  //   }).catch(err => {
  //     console.log('Error Submitting data: ', err);
  //     setLoading(false);
  //   });
  // };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // console.log(prompt);

    // return;
    try {
      const response = await fetch(`${BASEURL}/generate-marketing-advice`, {
        body: JSON.stringify(prompt),
        method: 'POST',
        headers:{
          Authorization: `Bearer ${localStorage.getItem("musette-jwt")}`
        }
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

  const { data, prompt, error, handleInputChange, handleSubmit, loading } = useAiMarketingAdvisor();


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
      />
    );
  }

  return (
    <>
      <AlertDialogDemo
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