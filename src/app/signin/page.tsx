// Start: Imports
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
// End: Imports

// Start: Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// End: Supabase Client Configuration

// Start: Type Definitions
interface SignInFormData {
  email: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}
// End: Type Definitions

// Start: SignInPage Component
export default function SignInPage() {
  // Start: State Management
  const [formData, setFormData] = useState<SignInFormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const router = useRouter();
  // End: State Management

  // Start: Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // End: Handle Input Changes

  // Start: Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedsVerification(false);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message === 'User not found' || signInError.message === 'Invalid login credentials') {
          throw new Error('Emasukan tidak sah');
        }
        if (signInError.message === 'User not confirmed') {
          setNeedsVerification(true);
          return;
        }
        throw signInError;
      }

      if (data?.user && !data.user.email_confirmed_at) {
        setNeedsVerification(true);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Log masuk gagal';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // End: Handle Form Submission

  // Start: Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setNeedsVerification(false);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Log masuk Google gagal';
      setError(errorMessage);
      setLoading(false);
    }
  };
  // End: Handle Google Sign In

  // Start: Render SignInPage Component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Hey there! Log Masuk ke akaun anda
          </h2>
        </div>
        
        {needsVerification && (
          <div className="rounded-md bg-yellow-100 dark:bg-yellow-900 p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              akaun anda belum diverifikasi. Sila semak emel anda untuk pautan verifikasi.
            </p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-none shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Emel
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Emel"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Kata Laluan
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Kata Laluan"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Log Masuk...' : 'Log Masuk'}
            </button>
          </div>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 dark:bg-gray-900 text-gray-500">ATAU</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Log Masuk dengan Google...' : 'Log Masuk dengan Google'}
          </button>
          
          {/* Start: Password Recovery Links */}
          <div className="text-center text-sm">
            <a
              href="/password_reset"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Set Semula Kata Laluan
            </a>
            <span className="mx-2 text-gray-500">|</span>
            <a
              href="/forgot_username"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Lupa Nama Pengguna
            </a>
          </div>
          {/* End: Password Recovery Links */}
        </form>
      </div>
    </div>
  );
}
// End: SignInPage Component
