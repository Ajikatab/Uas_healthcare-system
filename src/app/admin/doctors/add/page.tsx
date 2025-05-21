'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AddDoctorPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Protect the route
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  if (session?.user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      specialization: formData.get('specialization')
    };

    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create doctor');
      }

      router.push('/admin/doctors');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add New Doctor
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="specialization"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              id="specialization"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
