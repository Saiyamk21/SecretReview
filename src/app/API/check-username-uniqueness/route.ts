import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUp";

const usernameQuerySchema=z.object({
    username:userNameValidation
})

export async function GET(request:Request){
    await dbConnect();
    try {
        //localhost:100/aos?username=saiyam?phone=aa
        const {searchParams}=new URL(request.url);
        const queryparam={
            username:searchParams.get('username')
        }
        // validate zod
        const result=usernameQuerySchema.safeParse(queryparam);
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message:"pleasse enter a valid username"
            },{status:400})
        }
        const {username}=result.data;
        const existingVerifiedUser=await userModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"username already taken"
            },{status:400})
        }
        return Response.json({
            success:true,
            message:"username is unique"
        })
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Error checking username",
        })
    }
}