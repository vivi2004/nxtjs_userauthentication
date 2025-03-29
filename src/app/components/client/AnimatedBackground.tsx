// components/client/AnimatedBackground.tsx
"use client";
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div className="fixed top-1/3 -right-32 w-96 h-96 bg-purple-100 rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-blob" />
      <div className="fixed top-1/2 -left-32 w-96 h-96 bg-blue-100 rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
    </>
  );
}