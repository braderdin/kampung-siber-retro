import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-6">The page you are looking for does not exist.</p>
        <Link href="/" className="text-blue-400 hover:underline">
          Go back to home
        </Link>
      </div>
    </div>
  );
}