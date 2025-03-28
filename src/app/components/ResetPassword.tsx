// app/components/ResetPasswordForm.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.post("/api/users/verify-reset-token", { userId, token });
        setValidToken(true);
      } catch (error) {
        toast.error("Invalid or expired reset link");
        router.push("/login");
      }
    };

    if (userId && token) verifyToken();
    else router.push("/login");
  }, [userId, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords don't match");
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/users/reset-password", {
        userId,
        token,
        password
      });
      
      if (response.data.success) {
        toast.success("Password reset successfully!");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) return <div className="text-center p-8">Validating token...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl mb-4">Reset Your Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 px-4">
        <div>
          <label htmlFor="password" className="block mb-2">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
            minLength={6}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}