// Start: Imports
'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
// End: Imports

// Start: Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// End: Supabase Client Configuration

// Start: Type Definitions
interface ForgotUsernameFormData {
  email: string;
}

interface ForgotUsernameResponse {
  success: boolean;
  username?: string;
  error?: string;
}
// End: Type Definitions

// Start: ForgotUsernamePage Component
export default function ForgotUsernamePage() {
  // Start: State Management
  const [formData, setFormData] = useState<ForgotUsernameFormData>({ email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  // End: State Management

  // Start: Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });
  };
  // End: Handle Input Changes

  // Start: Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('email', formData.email)
        .single();

      if (fetchError) {
        throw new Error('Emel tidak ditemui dalam pelayan');
      }

      if (data) {
        setUsername(data.username);
      } else {
        setError('Tidak dapat menemui nama pengguna untuk emel ini');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mendapatkan nama pengguna';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // End: Handle Form Submission

  // Start: Render ForgotUsernamePage Component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Lupa Nama Pengguna
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Masukkan emel anda untuk mendapatkan nama pengguna anda
          </p>
        </div>
        
        {username ? (
          <div className="text-center py-4">
            <div className="rounded-md bg-blue-100 dark:bg-blue-900 p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Nama pengguna anda ialah: <strong>{username}</strong>
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
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mencari...' : 'Cari Nama Pengguna'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
// End: ForgotUsernamePage Component
