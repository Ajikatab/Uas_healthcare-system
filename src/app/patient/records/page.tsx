'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MedicalRecord {
  id: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  createdAt: string;
}

export default function ViewRecords() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/patient/dashboard')}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Medical Records</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {records.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">No medical records found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Diagnosis: {record.diagnosis}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Prescription: {record.prescription}
                  </p>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Notes: {record.notes}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Date: {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
