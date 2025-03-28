"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({ email: "", password: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            toast.success("Login successful!");
            router.push("/profile");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.email && user.password));
    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">
                        {loading ? "Securely logging you in..." : "Sign in to your account"}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-300 hover:shadow-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link 
                                    href="/forgot-password" 
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                type="password"
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            onClick={onLogin}
                            disabled={buttonDisabled || loading}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                                buttonDisabled || loading 
                                ? "bg-gray-300 cursor-not-allowed text-gray-500" 
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link 
                            href="/signup" 
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Create account
                        </Link>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                        <svg 
                            className="w-4 h-4 text-green-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        <span>Your data is securely encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
}