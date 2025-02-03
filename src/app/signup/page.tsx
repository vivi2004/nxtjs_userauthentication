"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13+
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

type User = {
  email: string;
  password: string;
  username: string;
};


export default function SignupPage() {
  const router = useRouter();

  // State for user input
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    username: "",
  });

  // State for button disabled status and loading indicator
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to handle signup logic
  const onSignup = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("Signup successful! Redirecting to login...");
      router.push("/login");
    } catch (error) {
      // Enhanced error handling using AxiosError type
      if (axios.isAxiosError(error)) {
        const errorMessage =
          (error.response?.data as { message?: string })?.message ||
          "Signup failed. Please try again.";
        console.error("Signup failed", error);
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to enable/disable the button based on user input
  useEffect(() => {
    const { email, password, username } = user;
    setButtonDisabled(!(email.trim() && password.trim() && username.trim()));
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
      <h1>{loading ? "Processing..." : "Signup"}</h1>
      <hr className="w-full max-w-md my-4" />
      <label htmlFor="username">Username</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        id="username"
        type="text"
        value={user.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUser({ ...user, username: e.target.value })
        }
        placeholder="username"
      />
      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        id="email"
        type="email"
        value={user.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUser({ ...user, email: e.target.value })
        }
        placeholder="email"
      />
      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        id="password"
        type="password"
        value={user.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUser({ ...user, password: e.target.value })
        }
        placeholder="password"
      />
      <button
        className={`p-2 rounded-lg ${
          buttonDisabled || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        onClick={onSignup}
        disabled={buttonDisabled || loading}
      >
        {loading ? "Processing..." : "Sign Up"}
      </button>
      <Link href="/login" className="mt-4 text-blue-500 hover:underline">
        Already have an account? Login
      </Link>
    </div>
  );
}
