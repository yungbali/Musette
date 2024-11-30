import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ChevronLeft, ChevronRight, LucideLoaderCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"



interface PropsData {
    data: string;
    error: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSlectInputChange: (value: string)=> void;
    handleSubmit: () => Promise<void>;
    loading: boolean;
    prompt: {
        band_name: string,
        genre: string,
        target_audience: string,
        current_followers: string,
        streams: string,
        budget: string,
        advice: string,

        // industry: string,
        // goals: string,
        // usp: string,
        // marketing_channels: string,
        // competitors: string,
        // timeframe: string,
        // brand_voice: string,
        // products_services: string,
        // region: string
    }
}



const AiMarketingAdvisorForm = ({ loading, handleInputChange, handleSlectInputChange, handleSubmit, prompt }: PropsData) => {

    const [step, setStep] = useState(1)
    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    // const [conversation, setConversation] = useState<{type: string; message: string;}[]>([])
    // const [userInput, setUserInput] = useState('')
    // const handleSendMessage = () => {
    //     if (userInput.trim()) {
    //         setConversation([...conversation, { type: 'user', message: userInput }])
    //         // Simulated AI response
    //         setTimeout(() => {
    //             setConversation(prev => [...prev, { type: 'ai', message: "Thank you for your input. I'm analyzing your data and will provide personalized marketing insights shortly." }])
    //         }, 1000)
    //         setUserInput('')
    //     }
    // }

    return (
        <>
            <Card className={`w-full max-w-2xl mx-auto ${loading ? "after:rounded-xl after:w-full after:h-full after:bg-[rgba(0,0,0,.1)] after:block after:blur-lg after:absolute after:top-0 after:left-0 after:z-50" : ""}`}>
                {loading && <div className='flex items-center justify-center rounded-xl w-full h-full absolute top-0 left-0'>
                    <LucideLoaderCircle className='animate-spin w-32 relative z-40' size={50} />
                </div>}
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#333333]">AI Marketing Advisor</CardTitle>
                    <CardDescription>Get personalized marketing insights powered by AI</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="band_name">Artist/Band Name</Label>
                                <Input onChange={handleInputChange} value={prompt.band_name} id="band_name" placeholder="Enter your artist or band name" />
                            </div>
                            <div>
                                <Label htmlFor="genre">Primary Genre</Label>
                                <Input onChange={handleInputChange} value={prompt.genre} id="genre" placeholder="e.g., Afrobeats, Hip-Hop, Jazz" />
                            </div>
                            <div>
                                <Label htmlFor="target-audience">Target Audience</Label>
                                <Select onValueChange={handleSlectInputChange} value={prompt.target_audience}>
                                    <SelectTrigger id="target_audience">
                                        <SelectValue placeholder="Select your target audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="18-24">18-24 years old</SelectItem>
                                        <SelectItem value="25-34">25-34 years old</SelectItem>
                                        <SelectItem value="35-44">35-44 years old</SelectItem>
                                        <SelectItem value="45+">45+ years old</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="current_followers">Current Followers</Label>
                                <Input onChange={handleInputChange} value={prompt.current_followers} id="current_followers" type="number" placeholder="Enter your current number of followers" />
                            </div>
                            <div>
                                <Label htmlFor="streams">Monthly Streams</Label>
                                <Input onChange={handleInputChange} value={prompt.streams} id="streams" type="number" placeholder="Enter your average monthly streams" />
                            </div>
                            <div>
                                <Label htmlFor="budget">Monthly Marketing Budget (USD)</Label>
                                <Input onChange={handleInputChange} value={prompt.budget} id="budget" type="number" placeholder="Enter your monthly marketing budget" />
                            </div>
                        </div>
                    )}
                    {/* {false && step === 3 && (
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 h-64 overflow-y-auto">
                                {conversation.map((msg, index) => (
                                    <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        <span className={`inline-block p-2 rounded-lg ${msg.type === 'user' ? 'bg-[#9D5465] text-white' : 'bg-gray-200 text-[#333333]'}`}>
                                            {msg.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Ask for marketing advice..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button onClick={handleSendMessage} className="bg-[#9D5465] hover:bg-[#8A4757] text-white">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )} */}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step > 1 && (
                        <Button onClick={prevStep} variant="outline">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                    )}
                    {step < 2 ? (
                        <Button onClick={nextStep} className="ml-auto bg-[#9D5465] hover:bg-[#8A4757] text-white">
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} className="ml-auto bg-[#9D5465] hover:bg-[#8A4757] text-white">
                            Finish
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </>
    )
}

export default AiMarketingAdvisorForm