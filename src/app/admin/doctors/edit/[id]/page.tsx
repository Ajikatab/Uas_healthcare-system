'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

export default function EditDoctorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const response = await fetch(`/api/admin/doctors/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch doctor');
        }
        
        setDoctor(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch doctor');
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user?.role === 'ADMIN') {
      fetchDoctor();
    }
  }, [session, params.id]);

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
      const res = await fetch(`/api/admin/doctors/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update doctor');
      }

      router.push('/admin/doctors');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-red-600">Doctor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Doctor
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
              defaultValue={doctor.name}
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
              defaultValue={doctor.specialization}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white sm:text-sm"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/doctors')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
