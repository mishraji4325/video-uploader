import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        await connectToDatabase()
        const videos = await Video.find({}).sort({createdAt: -1}).lean()
        
        if(!videos || videos.length === 0){
            return NextResponse.json([], {status:200})
        }
        return NextResponse.json(videos, {status:200})
    }catch(error){
        return NextResponse.json({error: "Failed to get videos"},  
        {status:500})
    }
}

export async function POST(request:NextRequest){
    try{
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
                {error: "You are not logged in"},
                {status:401}
            );
        }
        await connectToDatabase()

        const body: IVideo = await request.json()
        if(
            !body.title ||
            !body.videoUrl ||
            !body.description ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "Title and videoUrl are required"},
                {status:400}
            );
        }
        const videoData = {
            ...body,
            control: body?.controls ?? true,
            transformation:{
                height:1920,
                width:1080,
                quality:body.transformation?.quality ?? 100,
            }
        };
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo, {status:200})
    }catch(error){
        return NextResponse.json({error: "Failed to create video"}, 
        {status:500})

    }
}