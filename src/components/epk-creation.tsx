import MarkDownDisplay from './react-markdown'
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import EpkGenerationForm from './epk-creation-form';
import { BASEURL } from '../util/baseUrl';

interface PromptType {
  artist_name: string;
  biography: string;
  genre: string;
  profile_picture: FileList | null;
  music_links: string;
  social_media: string;
  press_release_news: string;
  achievements: string;
  contact_information: string;
}

interface PropsData {
  data: string;
  error: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: () => Promise<void>;
  loading: boolean;
  prompt: PromptType;
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
        <EpkGenerationForm
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




const useEpkGenerator = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const [prompt, setPrompt] = useState<PromptType>({
    artist_name: '',
    biography: '',
    genre: '',
    profile_picture: null,
    music_links: '',
    social_media: '',
    press_release_news: '',
    achievements: '',
    contact_information: ''
  });


  const handleFilInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPrompt({
        ...prompt,
        profile_picture: e.target.files
      });
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

    // if (e.target.id === 'profile_picture' && e.target instanceof HTMLInputElement && e.target.files) {
    //   setPrompt(prevPrompt => ({
    //     ...prevPrompt,
    //     profile_picture: e.target.files
    //   }));
    //   return;
    // }

    setPrompt(prevPrompt => ({
      ...prevPrompt,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    for (const [key, val] of Object.entries(prompt)) {
      if (key === 'profile_picture') continue;
      formData.append(key, val);
    }

    if(prompt.profile_picture) {
      formData.append('image', prompt.profile_picture[0]);
    }
    
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }


    try {
      const response = await fetch(`${BASEURL}/generate-epk`, {
        body: formData,
        method: 'POST'
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
    handleFilInputChange,
    data,
    loading,
    error,
    prompt
  }
}



export function EPKCreation() {

  const { data, error, handleInputChange, handleSubmit, loading, prompt } = useEpkGenerator();


  const uiToShow = data ? 1 : 0;
  if (uiToShow === 0) {
    return (
      <EpkGenerationForm
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
