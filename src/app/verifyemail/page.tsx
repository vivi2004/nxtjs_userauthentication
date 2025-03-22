"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state
    const searchParams = useSearchParams();

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token });
            setVerified(true);
        } catch (error: any) {
            setError(true);
            console.error("Verification error:", error.response?.data);
        } finally {
            setLoading(false); // Stop loading after API call
        }
    };

    useEffect(() => {
        const urlToken = searchParams.get("token");
        setToken(urlToken || "");

        // If token is missing, trigger error immediately
        if (!urlToken) {
            setError(true);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (token) {
            verifyUserEmail();
        } else {
            setLoading(false); // Stop loading if no token
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl mb-4">Email Verification</h1>

            {/* Show loading only if no error and not verified */}
            {loading && !error && !verified && (
                <div className="text-lg">Verifying your email...</div>
            )}

            {/* Success state */}
            {verified && (
                <div className="text-center">
                    <p className="text-2xl text-green-600 mb-4">
                        Email verified successfully!
                    </p>
                    <Link
                        href="/login" >
                        Login

                    </Link>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="text-center">
                    <p className="text-2xl text-red-600 mb-4">
                        Verification failed
                    </p>
                    <p className="text-gray-600">
                        {token ? "Invalid or expired token" : "Missing verification token"}
                    </p>
                </div>
            )}
        </div>
    );
}