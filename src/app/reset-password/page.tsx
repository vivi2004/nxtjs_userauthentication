// src/app/components/ResetPasswordForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  const token = searchParams.get("token") ?? "";

  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !token) return router.replace("/login");
    axios
      .post("/api/users/verify-reset-token", { userId, token })
      .then(() => setValid(true))
      .catch(() => {
        toast.error("Invalid or expired link");
        router.replace("/login");
      });
  }, [userId, token, router]);

  if (valid === null) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords don't match");

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
      toast.error(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* ...your inputs and button here... */}
    </form>
  );
}
