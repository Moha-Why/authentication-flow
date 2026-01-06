# Authentication Flow – TinyTales

This project implements an **authentication flow** as part of a **job task**.  
It focuses on **login, registration, and email verification** using a modern Next.js setup.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Auth & Database)
- JWT Authentication
- Nodemailer (Email Verification)

## Features

- User registration
- User login
- JWT-based authentication
- Email verification flow
- Secure environment-based configuration

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install


2. Environment Variables

Create a .env file in the project root and add the following:

JWT_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
VERIFICATION_CODE=123456

3. Run the Development Server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


Open the app in your browser:

http://localhost:3000
# or
bun install
