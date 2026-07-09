"use client";

import Link from 'next/link';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-400">Something went wrong!</h1>
        <p className="text-gray-400 mb-4">{error?.message || 'An error occurred'}</p>
        <Link href="/" className="text-blue-400 hover:underline">
          Go back to home
        </Link>
      </div>
    </div>
  );
}