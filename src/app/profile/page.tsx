"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState<string>("nothing");

    const logout = async () => {
        try {
            await axios.get('/api/users/logout');
            toast.success('Logout successful');
            router.push('/login');
        } catch (error: unknown) {
            let errorMessage = "Logout failed";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error(errorMessage);
            toast.error(errorMessage);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/me');
            setData(res.data.data._id);
        } catch (error: unknown) {
            let errorMessage = "Failed to fetch user details";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Profile
                    </h1>
                    <p className="text-gray-600">
                        Manage your account details and security
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-300 hover:shadow-2xl">
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-700">
                                Account Information
                            </p>
                            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                                <span className="text-sm text-gray-600">User ID:</span>
                                <div className="mt-2">
                                    {data === 'nothing' ? (
                                        <span className="text-gray-400">No data available</span>
                                    ) : (
                                        <Link
                                            href={`/profile/${data}`}
                                            className="text-blue-600 hover:text-blue-500 font-medium break-all"
                                        >
                                            {data}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={getUserDetails}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Get User Details
                            </button>
                            
                            <button
                                onClick={logout}
                                className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        Need help?{" "}
                        <Link 
                            href="/support" 
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Contact support
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>Your account is securely protected</span>
                    </div>
                </div>
            </div>
        </div>
    );
}