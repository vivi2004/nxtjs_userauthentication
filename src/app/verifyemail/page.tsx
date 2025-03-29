"use client";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    const verifyUserEmail = useCallback(async () => {
        try {
            await axios.post('/api/users/verifyemail', { token });
            setVerified(true);
        } catch (error) {
            setError(true);
            if (axios.isAxiosError(error)) {
                console.error("Verification error:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        const urlToken = searchParams.get("token");
        setToken(urlToken || "");

        if (!urlToken) {
            setError(true);
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        if (token) {
            verifyUserEmail();
        } else {
            setLoading(false);
        }
    }, [token, verifyUserEmail]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Email Verification
                </h1>

                {loading && !error && !verified && (
                    <div className="space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-600">Verifying your email...</p>
                    </div>
                )}

                {verified && (
                    <div className="space-y-4">
                        <div className="text-green-500">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-xl font-semibold text-green-600">
                            Email verified successfully!
                        </p>
                        <Link
                            href="/login"
                            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Continue to Login
                        </Link>
                    </div>
                )}

                {error && (
                    <div className="space-y-4">
                        <div className="text-red-500">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-xl font-semibold text-red-600">
                            Verification failed
                        </p>
                        <p className="text-gray-600">
                            {token ? "Invalid or expired token" : "Missing verification token"}
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                        >
                            Try signing up again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}