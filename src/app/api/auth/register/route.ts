import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import type { FormData } from "@/src/types/types";
import { supabase } from "@/src/lib/supabase-client";


export async function POST(request: Request) {
    const body : FormData = await request.json();

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(body.password, salt)
        const token = jwt.sign({email: body.email}, process.env.JWT_SECRET_KEY as string)
        const data = {
            name: body.fullName,
            email: body.email,
            mobile_country_code: body.mobile_country_code,
            mobile: body.mobile,
            password: hashedPassword,
            token,        
        }
        const { data: existingUser, error } = await supabase.from("users").insert(data).select().single();
        if (error) {
            throw error;
        }
        const {password, ...userWithoutPassword} = existingUser;
        return NextResponse.json({ 
            status: "success",
            statusCode: 200,
            data: userWithoutPassword,
            message: "تم إنشاء الحساب بنجاح"
        });
    } catch (error) {
        return NextResponse.json({ 
            status: "error",
            statusCode: 400,
            message: error
        });
    }


}