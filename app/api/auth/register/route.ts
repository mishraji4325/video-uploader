import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest){
    try{
        const {email, password} = await request.json()

        if (!email || !password){
            return NextResponse.json({
                error: "Email and password are required"
            },{status:400})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return NextResponse.json({
                error: "User already exists"
            },{status:400})
        }

        const user = await User.create({
            email,
            password
        })
        return NextResponse.json(
            {message: "User registered successfully", userId: user._id},
            {status:201},
        )
    }catch (error){
        console.error("Error registering user:", error);
        return NextResponse.json(
            {error: "Something went wrong"}, 
            {status:500}
        )
    }
}