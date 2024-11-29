import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, LucideLoaderCircle } from 'lucide-react'



interface PropsData {
    data: string;
    error: string;
    handleInputChange: (e: React.ChangeEventHandler) => void;
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



const MarketingPlansForm = ({ loading, handleInputChange, handleSubmit, prompt }: PropsData) => {



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
                            <Input onChange={handleInputChange} value={prompt.artist_name} id="artist_name" placeholder="Enter your artist or band name" />
                        </div>
                        <div>
                            <Label htmlFor="genre">Primary Genre</Label>
                            <Input onChange={handleInputChange} value={prompt.genre} id="genre" placeholder="e.g., Afrobeats, Hip-Hop, Jazz" />
                        </div>
                        <div>
                            <Label htmlFor="target_audience">Target Audience</Label>
                            <Input onChange={handleInputChange} value={prompt.target_audience} id="target_audience" placeholder="e.g., 18-24 year olds, college students" />
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="goals">Marketing Goals</Label>
                            <Textarea onChange={handleInputChange} value={prompt.goals} id="goals" placeholder="What do you want to achieve with this marketing plan?" />
                        </div>
                        <div>
                            <Label htmlFor="budget">Marketing Budget (USD)</Label>
                            <Input onChange={handleInputChange} value={prompt.budget} id="budget" type="number" placeholder="Enter your marketing budget" />
                        </div>
                        <div>
                            <Label htmlFor="timeline">Campaign Timeline</Label>
                            <Input onChange={handleInputChange} value={prompt.timeline} id="timeline" placeholder="e.g., 3 months, 6 months" />
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="channels">Preferred Marketing </Label>
                            <Textarea onChange={handleInputChange} value={prompt.channels} id="channels" placeholder="e.g., Social Media, Radio, Music Blogs" />
                        </div>
                        <div>
                            <Label htmlFor="assets">Available Marketing Assets</Label>
                            <Textarea onChange={handleInputChange} value={prompt.assets} id="assets" placeholder="e.g., Press Photos, Music Videos, EPK" />
                        </div>
                        <div>
                            <Label htmlFor="additional_information">Additional Information</Label>
                            <Textarea onChange={handleInputChange} value={prompt.additional_information} id="additional_information" placeholder="Any other details that might help in creating your marketing plan" />
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
                    <Button disabled={loading} onClick={handleSubmit} className="ml-auto bg-[#9D5465] hover:bg-[#8A4757] text-white">
                        Submit Plan
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default MarketingPlansForm