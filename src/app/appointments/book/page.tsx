'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Doctor {
  id: string;
  name: string;
  specialization: string | null;
}

export default function BookAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data.data);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
      }
    }

    if (status === 'authenticated') {
      fetchDoctors();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const dateTime = `${formData.get('date')}T${formData.get('time')}:00.000Z`;

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: formData.get('doctorId'),
          dateTime,
          notes: formData.get('notes'),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to book appointment');
      }

      router.push('/appointments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  // Get available time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  // Calculate min and max dates
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book Appointment
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
              htmlFor="doctorId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Select Doctor
            </label>
            <select
              id="doctorId"
              name="doctorId"
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:text-white"
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              min={minDate}
              max={maxDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Time
            </label>
            <select
              id="time"
              name="time"
              required
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Any additional information for the doctor..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
