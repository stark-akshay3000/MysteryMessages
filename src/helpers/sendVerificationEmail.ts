import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";

export async function  sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
) :Promise<ApiResponse>{
    try{

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry message Verification Code',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {
            success:true,
            message:"Verification Email sent successfully"
        }
 
    }catch(error){
        console.error("Error sending verification email",error);
        return{success:false,message:"failed to send verification Email"}
    }
}