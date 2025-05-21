'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (session?.user?.role !== 'PATIENT') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'PATIENT') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Patient Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300 mr-4">
                Welcome, {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/auth' })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Appointments Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-blue-500 dark:text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Upcoming Appointments
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        0
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <button
                    onClick={() => router.push('/appointments/book')}
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Book New Appointment
                  </button>
                </div>
              </div>
            </div>

            {/* Medical Records Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-green-500 dark:text-green-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Medical Records
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        0
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <button
                    onClick={() => router.push('/patient/records')}
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Records
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-purple-500 dark:text-purple-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Profile Information
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {session.user.email}
                    </dd>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <button
                    onClick={() => router.push('/patient/profile')}
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
