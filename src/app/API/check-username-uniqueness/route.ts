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
        console.log(result);
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message:"Please enter a valid username",usernameErrors
            },{status:400})
        }
        const {username}=result.data;
        const existingVerifiedUser=await userModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username already taken"
            },{status:400})
        }
        return Response.json({
            success:true,
            message:"Username is unique"
        },{status:200})
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Error checking username",
        },{status:500})
    }
}