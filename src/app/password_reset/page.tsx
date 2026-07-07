// Start: Imports
'use client';
import { useEffect, useState } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';
// End: Imports

// Start: Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// End: Supabase Client Configuration

// Start: Type Definitions
interface PasswordResetFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordResetResponse {
  success: boolean;
  error?: string;
}
// End: Type Definitions

// Start: PasswordResetPage Component
export default function PasswordResetPage() {
  // Start: State Management
  const [formData, setFormData] = useState<PasswordResetFormData>({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  // End: State Management

  // Start: Check for Session on Mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, []);
  // End: Check for Session on Mount

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

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Kata laluan baru tidak sepadan');
      setLoading(false);
      return;
    }

    if (!session) {
      setError('Sila log masuk untuk set kata laluan');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal set kata laluan';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // End: Handle Form Submission

  // Start: Render PasswordResetPage Component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Set Semula Kata Laluan
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Masukkan kata laluan baru anda
          </p>
        </div>
        
        {success ? (
          <div className="text-center py-4">
            <div className="rounded-md bg-green-100 dark:bg-green-900 p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                Kata laluan berjaya diset semula!
              </p>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </div>
            )}
            
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
                  disabled
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="sr-only">
                  Kata Laluan Baru
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Kata Laluan Baru"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Pastikan Kata Laluan
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Pastikan Kata Laluan"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sedang diset semula...' : 'Set Semula Kata Laluan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
// End: PasswordResetPage Component
