"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  name: string;
}

export default function Page() {
  const [userData, setUserData] = useState<UserData>({ name: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter()

  const handleLogOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await fetch(
          `/api/auth/user-data`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Error
            </h2>
            <p className="text-error mb-4">{error}</p>
            <Link
              href="/login"
              className="bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary-hover transition-all"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Dashboard
          </h1>
          <p className="text-2xl text-text-secondary">
            Hello, <span className="text-primary font-semibold">{userData.name}</span>
          </p>
          <button onClick={handleLogOut} className="text-primary hover:text-primary-hover transition duration-300 underline mt-2 text-lg">Log Out</button>
        </div>
      </div>
    </div>
  );
}