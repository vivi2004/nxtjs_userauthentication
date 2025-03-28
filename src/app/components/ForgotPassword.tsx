// app/components/ForgotPasswordForm.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post("/api/users/forgot-password", { email });
      if (response.data.success) {
        toast.success("Password reset email sent!");
        setEmailSent(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl mb-4">{loading ? "Processing..." : "Reset Password"}</h1>
      
      {!emailSent ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 px-4">
          <div>
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-green-600 mb-4">Check your email for reset instructions</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}




