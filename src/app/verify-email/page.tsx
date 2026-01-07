"use client";

import { send } from "process";
import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import type { StatusMessage } from "@/src/types/types";

export default function EmailVerificationPage() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    type: "",
    text: "",
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const sendCode = async () => {
    try {
        if (!localStorage.getItem("token")) {
            throw new Error("No token found");
        };
        const response = await fetch(`/api/auth/verify-email/resend-code`,
            {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
    } catch (error) {
      console.error("Error sending code:", error);
    }
  }
  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    sendCode()
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Clear status message when user starts typing
    if (statusMessage.text) {
      setStatusMessage({ type: "", text: "" });
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }

    // Handle Enter key to submit
    if (e.key === "Enter" && code.every((digit) => digit !== "")) {
      handleVerify();
    }

    // Handle left/right arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setStatusMessage({
        type: "error",
        text: "Please enter all 6 digits",
      });
      return;
    }

    setIsVerifying(true);
    setStatusMessage({ type: "", text: "" });
    console.log(verificationCode)
    try {
        const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // send token here
        },
        body: JSON.stringify({ code: verificationCode }) // no need to include token in body
        });
      console.log(response)

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Email verified successfully! Redirecting...",
        });
        
        // Redirect after success (example)
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setStatusMessage({
          type: "error",
          text: "Invalid verification code. Please try again.",
        });
        // Clear code on error
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.log(error)
      setStatusMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setStatusMessage({ type: "", text: "" });

    try {
        if (!localStorage.getItem("token")) {
            throw new Error("No token found");
        };
        const response = await fetch(
        `/api/auth/verify-email/resend-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Verification code resent! Please check your email.",
        });
        // Clear existing code
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Failed to resend code. Please try again.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-text-primary mb-3">
          Verify your email
        </h1>

        {/* Description */}
        <p className="text-center text-text-secondary mb-8">
          We've sent a 6-digit verification code to your email address. Please
          enter it below to verify your account. Don't forget to check your
          spam folder.
        </p>

        {/* Status Message */}
        {statusMessage.text && (
          <div
            className={`mb-6 p-4 rounded-md text-sm font-medium text-center ${
              statusMessage.type === "success"
                ? "bg-green-50 text-success border border-green-200"
                : statusMessage.type === "error"
                ? "bg-red-50 text-error border border-red-200"
                : "bg-blue-50 text-primary border border-blue-200"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* 6-Digit Input Fields */}
        <div className="mb-8">
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {inputRefs.current[index] = el}}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(index, e)
                }
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={isVerifying}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying || code.some((digit) => digit === "")}
            className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-text-secondary">
              Didn't receive the code?
            </span>
          </div>
        </div>

        {/* Resend Button */}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="w-full bg-transparent text-primary py-2.5 px-4 rounded-md font-medium border border-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isResending ? "Sending..." : "Resend verification code"}
        </button>

        {/* Back to Login Link */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          <a
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}