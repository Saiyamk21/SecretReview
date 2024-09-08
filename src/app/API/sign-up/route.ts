import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationemail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true
        });
        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username already exists"
            }, { status: 400 });
        }

        const existingUserByEmail = await userModel.findOne({ email });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists"
                }, { status: 400 });
            } else {
                const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: true,
                isAcceptingMessage: false,
                message: []
            });
            await newUser.save();

            const emailResponse = await sendVerificationEmail(email, username, verifyCode);

            if (!emailResponse || !emailResponse.success) {
                return NextResponse.json({
                    success: false,
                    message: emailResponse?.message || "Failed to send verification email"
                }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: "Registration successful, please verify your email"
            }, { status: 200 });
        }
    } catch (error) {
        console.error("Error registering user", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 });
    }
}
