'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    if (session?.user?.role === 'ADMIN') {
      fetchStats();
    }
  }, [session]);

  if (status === 'loading') {
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
        <header className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Welcome back, {session?.user?.name}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Patients</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalPatients}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Doctors</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalDoctors}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Appointments</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalAppointments}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/doctors"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Doctors</h3>
              <span className="text-blue-600 dark:text-blue-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add, remove, or update doctor information</p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/admin/doctors/add"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Add New Doctor
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Link>

          <Link
            href="/admin/patients"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Patients</h3>
              <span className="text-green-600 dark:text-green-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and manage patient records</p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/admin/patients?view=all"
                className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                View All Patients
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Link>

          <Link
            href="/admin/appointments"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Appointments</h3>
              <span className="text-purple-600 dark:text-purple-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and manage all appointments</p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/admin/appointments?view=upcoming"
                className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                View Upcoming
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
