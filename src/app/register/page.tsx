"use client";

import Link from "next/link";
import { useState } from "react";
import { FormData, FormErrors, GlobalMessage } from "../../types/types";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    mobile_country_code: "",
    mobile: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [globalMessage, setGlobalMessage] = useState<GlobalMessage>({
    type: "",
    text: "",
  });
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Country Code validation
    if (!formData.mobile_country_code.trim()) {
      newErrors.countryCode = "Country code is required";
    }

    // Phone Number validation
    if (!formData.mobile.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(formData.mobile)) {
      newErrors.phoneNumber = "Phone number must contain only digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setGlobalMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      // console.log("Response Data:", data);

      if (response.ok) {
        setGlobalMessage({
          type: "success",
          text: "Registration successful! Welcome aboard.",
        });

        // Clear form on success
        setFormData({
          fullName: "",
          email: "",
          password: "",
          mobile_country_code: "",
          mobile: "",
        });
        if (data) {
          localStorage.setItem("token", data.data.token);
          router.push("/verify-email");
        }
      } else {
        setGlobalMessage({
          type: "error",
          text: data.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      setGlobalMessage({
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
        <h1 className="text-3xl font-bold text-center text-text-primary mb-6">
          Create Account
        </h1>

        {globalMessage.text && (
          <div
            className={`mb-6 p-4 rounded-md text-sm font-medium ${
              globalMessage.type === "success"
                ? "bg-green-50 text-success border border-green-200"
                : "bg-red-50 text-error border border-red-200"
            }`}
          >
            {globalMessage.text}
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-all"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-error">
                {errors.fullName}
              </p>
            )}
          </div>

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
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">
                {errors.email}
              </p>
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
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error">
                {errors.password}
              </p>
            )}
          </div>

          {/* Country Code & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label
                htmlFor="countryCode"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Country Code
              </label>
              <input
                type="text"
                id="countryCode"
                name="mobile_country_code"
                value={formData.mobile_country_code}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="+1"
                className="w-full px-4 py-2 border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-all"
              />
              {errors.countryCode && (
                <p className="mt-1 text-sm text-error">
                  {errors.countryCode}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-all"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-error">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2.5 px-4 rounded-md font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Registering…" : "Register"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}