import { resend } from "@/lib/resend";
import VerificationEmail from "../../Emails/VerificationEmails";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    try{
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {
            success:true,
            message:'verification send successfully'
        }
    }catch(emailError){
        console.log("error sending email",emailError);
        return {
            success:false,
            message:'failed to send email'
        }
    }
}