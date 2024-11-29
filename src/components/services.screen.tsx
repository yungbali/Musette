import { TabsContent } from '@radix-ui/react-tabs'
import { FileText, ImageIcon, MessageSquare, PenTool } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { AIMarketingAdvisor } from './ai-marketing-advisor'
import { AlbumArtwork } from './album-artwork'
import { EPKCreation } from './epk-creation'
import { MarketingPlans } from './marketing-plans'

const ServicesScreen = () => {

    const [screen, setScreen] = useState<'onboarding' | 'dashboard' | 'service'>('onboarding')
    const [activeService, setActiveService] = useState<string | null>(null)


    const renderServiceInterface = () => {
        switch (activeService) {
          case 'marketing-plans':
            return <MarketingPlans />
          case 'epk-creation':
            return <EPKCreation />
          case 'album-artwork':
            return <AlbumArtwork />
          case 'ai-marketing-advisor':
            return <AIMarketingAdvisor />
          default:
            return null
        }
      }



    return (
        <>
            <TabsContent value="services" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <ServiceCard
                        title="Marketing Plans"
                        description="Craft effective strategies to promote your music"
                        icon={<PenTool className="h-12 w-12 text-[#9D5465]" />}
                        credits={75}
                        onClick={() => {
                            setActiveService('marketing-plans')
                            setScreen('service')
                        }}
                    />
                    <ServiceCard
                        title="EPK Creation"
                        description="Build a professional Electronic Press Kit"
                        icon={<FileText className="h-12 w-12 text-[#9D5465]" />}
                        credits={100}
                        onClick={() => {
                            setActiveService('epk-creation')
                            setScreen('service')
                        }}
                    />
                    <ServiceCard
                        title="Album Artwork"
                        description="Design stunning visuals for your music"
                        icon={<ImageIcon className="h-12 w-12 text-[#9D5465]" />}
                        credits={50}
                        onClick={() => {
                            setActiveService('album-artwork')
                            setScreen('service')
                        }}
                    />
                    <ServiceCard
                        title="AI Marketing Advisor"
                        description="Get personalized marketing insights powered by AI"
                        icon={<MessageSquare className="h-12 w-12 text-[#9D5465]" />}
                        credits={60}
                        onClick={() => {
                            setActiveService('ai-marketing-advisor')
                            setScreen('service')
                        }}
                    />
                </div>
            </TabsContent>
        </>
    )
}

export default ServicesScreen


function ServiceCard({ title, description, icon, credits, onClick }) {
    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="pb-0">
                <div className="mb-2">{icon}</div>
                <CardTitle className="text-[#333333]">{title}</CardTitle>
                <CardDescription className="text-[#666666]">{description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
                <Button className="w-full bg-[#9D5465] hover:bg-[#8A4757] text-white" onClick={onClick}>Start Now</Button>
            </CardContent>
            <div className="absolute top-2 right-2 bg-[#9D5465] text-white text-sm font-semibold py-1 px-2 rounded-full">
                {credits} Credits
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#9D5465]/5 to-[#9D5465]/20 pointer-events-none" />
        </Card>
    )
}

