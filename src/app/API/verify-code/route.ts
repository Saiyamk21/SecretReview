import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { date } from "zod";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {username,code} = await request.json();
        
        const decodedUsername =decodeURIComponent(username);
        const user=await userModel.findOne({
            username:decodedUsername
        })
        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:500})
        }
        const iscodeValid=user.verifyCode===code;
        const isCodeNotExpire=new Date(user.verifyCodeExpiry)>new Date();
        if(iscodeValid && isCodeNotExpire){
            user.isVerified=true;
            await user.save();
            return Response.json({
                success:true,
                message:"Verified successfully"
            },{status:200})
        }else if(!iscodeValid){
            return Response.json({
                success:false,
                message:"Enter the valid code"
            },{status:400})
        }else if(!isCodeNotExpire){
            return Response.json({
                success:false,
                message:"code is expired"
            },{status:400})
        }

    } catch (error) {
        console.error("error verifiing code",error);
        return Response.json({
            success:false,
            message:"error verifing user"
        },{status:500})
    }
}