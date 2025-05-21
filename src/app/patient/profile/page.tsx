'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth: string;
  user: {
    name: string;
    email: string;
  };
}

export default function UpdateProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/auth');
      return;
    }

    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }));

      const fetchPatientData = async () => {
        try {
          setError('');
          const res = await fetch('/api/patient/profile', {
            headers: {
              'Accept': 'application/json'
            },
            cache: 'no-store'
          });
          
          if (!res.ok) {
            throw new Error(res.status === 404 ? 'Profile not found' : 'Failed to load profile');
          }

          const text = await res.text(); // First get response as text
          let data;
          try {
            data = JSON.parse(text); // Then try to parse it as JSON
          } catch (e) {
            console.error('Response text:', text);
            throw new Error('Invalid response format from server');
          }

          if (data.error) {
            throw new Error(data.error);
          }

          if (!data.data) {
            throw new Error('Invalid response format');
          }          const profile = data.data as PatientProfile;
          setFormData(prev => ({
            ...prev,            name: profile.user.name || '',
            email: profile.user.email || '',
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''
          }));
        } catch (error) {
          console.error('Error fetching patient data:', error);
          setError(error instanceof Error ? error.message : 'Failed to load profile');
        }
      };

      fetchPatientData();
    }
  }, [status, router, session]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    
    try {    const updateData = {
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth
      };

      const res = await fetch('/api/patient/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData),
      });

      // First get response as text
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text); // Then try to parse it as JSON
      } catch (e) {
        console.error('Response text:', text);
        throw new Error('Invalid response format from server');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccessMessage('Profile updated successfully');
      
      // Update session data to reflect changes
      if (session) {
        session.user.name = formData.name;
      }

      // After successful update, wait a moment before redirect
      setTimeout(() => {
        router.push('/patient/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18); // Must be at least 18 years old
  const maxDateStr = maxDate.toISOString().split('T')[0];

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
              <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Update Profile</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            {error && (
              <div className="mb-6 p-4 text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-100 rounded-md">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 p-4 text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-100 rounded-md">
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600"
                />
              </div>              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  max={maxDateStr}
                  value={formData.dateOfBirth}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push('/patient/dashboard')}
                    className="mr-3 rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
