import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, LucideLoaderCircle, Upload } from 'lucide-react' 

interface PropsData {
    data: string;
    error: string;
    handleInputChange: (e: React.ChangeEventHandler) => void;
    handleSubmit: () => Promise<void>;
    loading: boolean;
    prompt: {
        artist_name: string;
        biography: string;
        genre: string;
        profile_picture: string;
        music_links: string;
        social_media: string;
        press_release_news: string;
        achievements: string;
        contact_information: string;
    }
}



const EpkGenerationForm = ({ loading, handleInputChange, handleSubmit, prompt }: PropsData) => {



    const [step, setStep] = useState(1)
    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)






    return (
        <Card className={`w-full max-w-2xl mx-auto relative ${loading ? "after:rounded-xl after:w-full after:h-full after:bg-[rgba(0,0,0,.1)] after:block after:blur-lg after:absolute after:top-0 after:left-0 after:z-50" : ""}`}>
            {loading && <div className='flex items-center justify-center rounded-xl w-full h-full absolute top-0 left-0'>
                <LucideLoaderCircle className='animate-spin w-32 relative z-40' size={50} />
            </div>}
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#333333]">Create Marketing Plan</CardTitle>
                <CardDescription>Craft effective strategies to promote your music</CardDescription>
            </CardHeader>






            <CardContent>
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="artist_name">Artist/Band Name</Label>
                            <Input value={prompt.artist_name} onChange={handleInputChange} id="artist_name" placeholder="Enter your artist or band name" />
                        </div>
                        <div>
                            <Label htmlFor="biography">Biography</Label>
                            <Textarea value={prompt.biography} onChange={handleInputChange} id="biography" placeholder="Write a short bio (250-500 words)" />
                        </div>
                        <div>
                            <Label htmlFor="genre">Genre(s)</Label>
                            <Input value={prompt.genre} onChange={handleInputChange} id="genre" placeholder="e.g., Afrobeats, Hip-Hop, Jazz" />
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <Label>Profile Picture</Label>
                            <div className="mt-2 flex items-center justify-center w-full">
                                <label htmlFor="profile_picture" className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#9D5465] border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-[#9D5465]" />
                                        <p className="mb-2 text-sm text-[#666666]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-[#666666]">PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <Input onChange={handleInputChange} id="profile_picture" type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="music_links">Music Links</Label>
                            <Input value={prompt.music_links} onChange={handleInputChange} id="music_links" placeholder="Spotify, Apple Music, SoundCloud URLs" />
                        </div>
                        <div>
                            <Label htmlFor="social_media">Social Media</Label>
                            <Input value={prompt.social_media} onChange={handleInputChange} id="social_media" placeholder="Instagram, Twitter, Facebook URLs" />
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="press_release_news">Press Releases/News</Label>
                            <Textarea value={prompt.press_release_news} onChange={handleInputChange} id="press_release_news" placeholder="Any recent press releases or news about you" />
                        </div>
                        <div>
                            <Label htmlFor="achievements">Awards/Achievements</Label>
                            <Input value={prompt.achievements} onChange={handleInputChange} id="achievements" placeholder="List any awards or significant achievements" />
                        </div>
                        <div>
                            <Label htmlFor="contact_information">Contact Information</Label>
                            <Input value={prompt.contact_information} onChange={handleInputChange} id="contact_information" placeholder="Manager's email or official contact" />
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                {step > 1 && (
                    <Button onClick={prevStep} variant="outline">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                )}
                {step < 3 ? (
                    <Button onClick={nextStep} className="ml-auto bg-[#9D5465] hover:bg-[#8A4757] text-white">
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} className="ml-auto bg-[#9D5465] hover:bg-[#8A4757] text-white">
                        Create EPK
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default EpkGenerationForm