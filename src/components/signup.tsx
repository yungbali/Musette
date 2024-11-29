'use client'

import { useEffect, useState } from "react"
import { LucideLoaderCircle, Terminal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { CardFooter } from "./ui/card"

import axios from "axios"
import { Link, Navigate, useNavigate } from "react-router-dom"

const SignupScreen = () => {

    const navigation = useNavigate();


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loginData, setLoginData] = useState({
        name: '',
        email: '',
        password: ''
    });


    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        axios.post("http://localhost:3001/api/signup", loginData).then(res => {
            setLoading(false);
            localStorage.setItem('musette-jwt', res.data.jwt);
            navigation('/');
        }).catch(err => {
            setLoading(false);
            setError(err?.response?.data?.message);
            console.log('Error message is: ', err?.response?.data?.message);
        });

    };




    if (localStorage.getItem("musette-jwt")) {
        return <Navigate to={"/"} />
    }


    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl text-[#8A4757] font-bold mb-5">Musette</h1>
                <Card className={`w-full max-w-2xl mx-auto ${loading ? "after:rounded-xl after:w-full after:h-full after:bg-[rgba(0,0,0,.1)] after:block after:blur-lg after:absolute after:top-0 after:left-0 after:z-50" : ""}`}>
                    {loading && <div className='flex items-center justify-center rounded-xl w-full h-full absolute top-0 left-0'>
                        <LucideLoaderCircle className='animate-spin w-32 relative z-40' size={50} />
                    </div>}
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-[#333333]">Sign up</CardTitle>
                        <CardDescription>Create an account here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {(error && error.length > 0) && <Alert className="bg-red-600 mb-3">
                            <Terminal className="h-4 w-4 text-white" color="white" />
                            <AlertTitle className="text-white">{error}</AlertTitle>
                        </Alert>}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input onChange={e => setLoginData(prevData => ({ ...prevData, name: e.target.value }))}
                                    value={loginData.name}
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input onChange={e => setLoginData(prevData => ({ ...prevData, email: e.target.value }))}
                                    value={loginData.email}
                                    id="email"
                                    type="text"
                                    placeholder="Enter your email address"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input onChange={e => setLoginData(prevData => ({ ...prevData, password: e.target.value }))}
                                    value={loginData.password}
                                    id="password"
                                    type="password"
                                    placeholder="Enter your average monthly streams"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="block">
                        <div className="flex justify-between">
                            <Button onClick={handleSubmit} className="ml-auto bg-[#9D5465] hover:bg-[#8A4757] text-white">
                                Sign up
                            </Button>
                        </div>
                        <CardDescription className="text-center">Already have an account? <Link className="text-[#9D5465] hover:text-[#8A4757]" to={"/login"}>Login</Link></CardDescription>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default SignupScreen