import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenTool, FileText, Image, MessageSquare } from 'lucide-react'

export default function Dashboard() {
    return (
        <div className="container mx-auto p-6">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">Welcome to Afromuse Digital</h1>
                <p className="text-xl text-muted-foreground">Empowering African creators worldwide</p>
            </header>

            <Tabs defaultValue="services" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TabsTrigger value="services" className="text-lg">Services</TabsTrigger>
                    <TabsTrigger value="projects" className="text-lg">My Projects</TabsTrigger>
                    <TabsTrigger value="credits" className="text-lg">Credits</TabsTrigger>
                    <TabsTrigger value="profile" className="text-lg">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <ServiceCard
                            title="Marketing Plans"
                            description="Craft effective strategies to promote your music"
                            icon={<PenTool className="h-12 w-12 text-primary" />}
                            credits={75}
                        />
                        <ServiceCard
                            title="EPK Creation"
                            description="Build a professional Electronic Press Kit"
                            icon={<FileText className="h-12 w-12 text-primary" />}
                            credits={100}
                        />
                        <ServiceCard
                            title="Album Artwork"
                            description="Design stunning visuals for your music"
                            icon={<Image className="h-12 w-12 text-primary" />}
                            credits={50}
                        />
                        <ServiceCard
                            title="AI Marketing Advisor"
                            description="Get personalized marketing insights powered by AI"
                            icon={<MessageSquare className="h-12 w-12 text-primary" />}
                            credits={60}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="projects">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Projects</CardTitle>
                            <CardDescription>View and manage your ongoing projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Project list would go here */}
                            <p>You have no active projects. Start a new one from the Services tab!</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="credits">
                    <Card>
                        <CardHeader>
                            <CardTitle>Credit Balance</CardTitle>
                            <CardDescription>Manage your Afromuse Digital credits</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-4xl font-bold">250 Credits</div>
                            <Button>Purchase More Credits</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Profile</CardTitle>
                            <CardDescription>Manage your account settings and preferences</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Profile management options would go here */}
                            <p>Profile settings and options coming soon!</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function ServiceCard({ title, description, icon, credits }) {
    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="pb-0">
                <div className="mb-2">{icon}</div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
                <Button className="w-full">Start Now</Button>
            </CardContent>
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-sm font-semibold py-1 px-2 rounded-full">
                {credits} Credits
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 pointer-events-none" />
        </Card>
    )
}