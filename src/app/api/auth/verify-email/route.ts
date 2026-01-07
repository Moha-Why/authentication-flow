import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/src/lib/supabase-client";


export async function POST(request: Request) {
    const {code} = await request.json();
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization header missing or malformed");
    }
    const token = authHeader.split(" ")[1];
    
    try {
        const { email } = jwt.verify(token as string, process.env.JWT_SECRET_KEY as string) as { email: string };
        if (!email) {
            throw Error("TOKEN INVALID")
        }
        if (code === process.env.VERIFICATION_CODE) {
            const { error } = await supabase.from("users").update({email_verified_at: true}).eq("email", email)
            if (error) {
                throw error;
            }
        } else {
            throw Error("code invalid")
        }
        
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