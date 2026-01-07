import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/src/lib/supabase-client";


export async function GET(request: Request) {
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
        const { data, error } = await supabase.from("users").select("name").eq("email", email).single();
        if (error) {
            throw error;
        }
        return NextResponse.json({ 
            status: "success",
            data
        });
    } catch (error) {
        return NextResponse.json({ 
            status: "error",
            statusCode: 400,
            message: error,
        });
    }
}