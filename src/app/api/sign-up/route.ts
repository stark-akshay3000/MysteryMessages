import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { log } from "console";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        
        
        
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return NextResponse.json({ 
                success: false,
                message: "Username already taken"
            }, { status: 400 });
        }
       
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(verifyCode);
        
        if (existingUserByEmail) {
          
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists with this email"
                }, { status: 400 });
            } 
            
            else {
              
             
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
         else {
          console.log("here________________________");
          console.log(username); 
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
       console.log(email);
       
            const newUser = await  UserModel.create({
                username,
                email:email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });
            console.log("saving in database");
            
            // await newUser.save();
            
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message  
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email." 
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering user", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 });
    }
}
