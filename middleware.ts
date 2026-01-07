import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // You can attach decoded info to request if needed
    // req.user = decoded; // Not directly possible in middleware; you can pass via headers if needed
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/api/auth/user-data"], // change this to your protected routes
  runtime: "nodejs",
};
