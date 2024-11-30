import MarkDownDisplay from './react-markdown'
import MarketingPlansForm from './marketing-plans-form'
import { useState } from 'react';


import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { BASEURL } from '../util/baseUrl';



interface PropsData {
  data: string;
  error: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: () => Promise<void>;
  loading: boolean;
  prompt: {
    goals: string;
    artist_name: string;
    genre: string;
    target_audience: string;
    additional_information: string;
    assets: string;
    budget: string;
    channels: string;
    timeline: string;
  }
}



// function AlertDialogDemo({ children, onClick, loading }: { children: ReactNode, onClick: () => void, loading: boolean }) {
function AlertDialogDemo({ loading, data, error, handleInputChange, handleSubmit, prompt }: PropsData) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center justify-end" asChild>
        <div className='flex items-center justify-end'>
          <Button variant="outline" onClick={()=> {

          }}>Generate New Market Plan</Button>
        </div>
      </AlertDialogTrigger>
      {<AlertDialogContent>
        <MarketingPlansForm
          prompt={prompt}
          data={data} error={error}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogContent>}
    </AlertDialog>
  )
}




const useMarketingPlan = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const [prompt, setPrompt] = useState({
    goals: '',
    artist_name: '',
    genre: '',
    target_audience: '',
    additional_information: '',
    assets: '',
    budget: '',
    channels: '',
    timeline: ''
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPrompt(prevPrompt => ({
      ...prevPrompt,
      [e.target.id]: e.target.value
    }));
  };


  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${BASEURL}/generate-a-marketing-plan`, {
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
          if(reader) {
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
    data,
    loading,
    error,
    prompt
  }
}



export function MarketingPlans() {

  const { data, error, handleInputChange, handleSubmit, loading, prompt } = useMarketingPlan();


  const uiToShow = data ? 1 : 0;
  if (uiToShow === 0) {
    return (
      <MarketingPlansForm
        prompt={prompt}
        data={data} error={error}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    )
  };

  return (
    <>
      <AlertDialogDemo prompt={prompt}
        data={data} error={error}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      {(data && data.length > 0) && <MarkDownDisplay key={data} text={data} />}
    </>
  );
}
