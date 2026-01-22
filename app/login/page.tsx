"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

function LoginPage()  {
    const[email, setEmail]= useState('');
    const[password, setPassword]= useState('');
    const router = useRouter();

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const res = await signIn('credentials',{
            email,
            password,
            redirect:false,
        })
        if(res?.error){
            console.error(res.error)
        }else{
            router.push('/')
        }
    }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" 
        value={password} 
        onChange={(e)=>setPassword(e.target.value)}/>
        <button type="submit">
            Login</button>
      </form>
      <div>
        Don't have an account? <a href="/register">Register</a>
      </div>
    </div>
  )
}

export default LoginPage
