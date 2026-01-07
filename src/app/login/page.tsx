"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface StatusMessage {
  type: "success" | "error" | "";
  text: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter()
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    type: "",
    text: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear status message when user starts typing
    if (statusMessage.text) {
      setStatusMessage({ type: "", text: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setStatusMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });
        console.log(data)
        // Store token if provided
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        console.log(data)
        setStatusMessage({
          type: "error",
          text: data.message || "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-text-primary mb-2">
          Login to your account
        </h1>

        {/* Helper Text */}
        <p className="text-center text-text-secondary mb-8">
          Enter your email and password to continue
        </p>

        {/* Status Message */}
        {statusMessage.text && (
          <div
            className={`mb-6 p-4 rounded-md text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-green-50 text-success border border-green-200"
                : "bg-red-50 text-error border border-red-200"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Email"
              className="w-full px-4 py-2 border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Password"
              className="w-full px-4 py-2 border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2.5 px-4 rounded-md font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}