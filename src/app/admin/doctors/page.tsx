'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

export default function DoctorsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch('/api/admin/doctors');
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setDoctors(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user?.role === 'ADMIN') {
      fetchDoctors();
    }
  }, [session]);

  const handleDelete = async (doctorId: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }

      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete doctor');
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Doctors
            </h1>
            <Link
              href="/admin/doctors/add"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Doctor
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Specialization
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {doctor.specialization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/doctors/edit/${doctor.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mx-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
