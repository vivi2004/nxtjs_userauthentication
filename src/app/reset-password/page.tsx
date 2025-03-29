"use client";
import ResetPasswordForm from "@/app/components/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Set New Password
          </h1>
          <p className="text-gray-600 mt-3">
            Enter your new password below
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Decorative Gradient Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20"></div>
          
          {/* Form Container */}
          <div className="relative space-y-6">
            <ResetPasswordForm />
          </div>
        </div>

        {/* Security Assurance */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            <svg 
              className="inline-block w-4 h-4 mr-1 text-green-500" 
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
            Your password is securely encrypted
          </p>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed top-1/3 -right-32 w-96 h-96 bg-purple-100 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
      <div className="fixed top-1/2 -left-32 w-96 h-96 bg-blue-100 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-pink-100 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
    </div>
  );
}