import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


export async function POST(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization header missing or malformed");
    }
    const token = authHeader.split(" ")[1];

    try {
        const email = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const code = process.env.VERIFICATION_CODE; // static code for demo

        // Code for production
        // // create a transporter
        // const transporter = nodemailer.createTransport({
        //     host: process.env.SMTP_HOST,
        //     port: +process.env.SMTP_PORT!,
        //     secure: false, // true if using port 465
        //     auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASS,
        //     },
        // });
        // transporter.sendMail({
        // from: `"My App" <no-reply@myapp.com>`,
        // to: email as string,
        // subject: "Your verification code",
        // text: `Your verification code is: ${code}`,
        // }); 

        return NextResponse.json({ 
            status: "success",
        });
    } catch (error) {
        return NextResponse.json({ 
            status: "error",
            statusCode: 400,
            message: error
        });
    }
}