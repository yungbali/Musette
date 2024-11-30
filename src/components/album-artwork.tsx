import { useState } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Textarea } from "./ui/textarea"
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react'

export function AlbumArtwork() {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#333333]">Create Album Artwork</CardTitle>
        <CardDescription>Design stunning visuals for your music</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="album-title">Album/Single Title</Label>
              <Input id="album-title" placeholder="Enter the title of your album or single" />
            </div>
            <div>
              <Label htmlFor="artist-name">Artist/Band Name</Label>
              <Input id="artist-name" placeholder="Enter your artist or band name" />
            </div>
            <div>
              <Label>Artwork Type</Label>
              <RadioGroup defaultValue="digital">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital">Digital Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="physical" id="physical" />
                  <Label htmlFor="physical">Physical (CD/Vinyl)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" placeholder="e.g., Afrobeats, Hip-Hop, Jazz" />
            </div>
            <div>
              <Label htmlFor="mood">Mood/Theme</Label>
              <Input id="mood" placeholder="e.g., Energetic, Melancholic, Romantic" />
            </div>
            <div>
              <Label htmlFor="color-scheme">Preferred Color Scheme</Label>
              <Input id="color-scheme" placeholder="e.g., Warm tones, Monochrome, Vibrant" />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Reference Images</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label htmlFor="reference-images" className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#9D5465] border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-[#9D5465]" />
                    <p className="mb-2 text-sm text-[#666666]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-[#666666]">PNG, JPG (MAX. 5MB each)</p>
                  </div>
                  <Input id="reference-images" type="file" multiple className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="additional-notes">Additional Notes</Label>
              <Textarea id="additional-notes" placeholder="Any specific ideas or elements you want to include?" />
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
          <Button className="ml-auto bg-[#9D5465] hover:bg-[#8A4757] text-white">
            Submit Artwork Request
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}