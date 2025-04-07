// src/app/components/ResetPasswordForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // grab params (won't be null if someone hit this page properly)
  const userId = searchParams.get("userId") ?? "";
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // on‑mount, verify the reset link
  useEffect(() => {
    if (!userId || !token) {
      router.replace("/login");
      return;
    }

    const verify = async () => {
      try {
        await axios.post("/api/users/verify-reset-token", { userId, token });
        setValidToken(true);
      } catch {
        toast.error("Invalid or expired link");
        router.replace("/login");
      }
    };

    verify();
  }, [userId, token, router]);

  // show spinner while verifying
  if (validToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600">Verifying link…</p>
      </div>
    );
  }

  // once verified, show the reset form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/users/reset-password", {
        userId,
        token,
        password,
      });
      toast.success(data.message || "Password reset!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          id="password"
          type="password"
          minLength={6}
          required
          disabled={loading}
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          minLength={6}
          required
          disabled={loading}
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-white rounded-lg font-medium transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  );
}


