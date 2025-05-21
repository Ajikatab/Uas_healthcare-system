'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const action = searchParams.get('action') || 'login';
  const isLogin = action === 'login';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      if (isLogin) {
        // Handle login using NextAuth
        const result = await signIn('credentials', {
          redirect: false,
          name: formData.get('name') as string,
          password: formData.get('password') as string,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        // Redirect based on role stored in session
        if (result?.ok) {
          const response = await fetch('/api/auth/session');
          const session = await response.json();
          
          if (session?.user?.role === 'DOCTOR') {
            router.push('/doctor/dashboard');
          } else if (session?.user?.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else {
            router.push('/patient/dashboard');
          }
        }
      } else {
        // Handle registration (patient only)
        const data = {
          email: formData.get('email'),
          password: formData.get('password'),
          name: formData.get('name'),
          role: 'PATIENT',
          dateOfBirth: formData.get('dateOfBirth'),
        };

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          if (result.error) {
            if (Array.isArray(result.error)) {
              throw new Error(result.error.map((e: any) => e.message).join(', '));
            } else {
              throw new Error(result.error);
            }
          }
          throw new Error('Registration failed');
        }

        // After successful registration, redirect to login
        router.push('/auth?action=login');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Login' : 'Create Patient Account'}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isLogin
              ? 'Log in to your account'
              : 'Sign up as a new patient'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Log In' : 'Create Patient Account'
              )}
            </button>

            <div className="text-center text-sm">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <Link href="/auth?action=register" className="text-blue-600 hover:text-blue-500">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link href="/auth?action=login" className="text-blue-600 hover:text-blue-500">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
