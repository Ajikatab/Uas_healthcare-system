import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Healthcare Appointment System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Schedule appointments with healthcare professionals easily and securely
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Patient Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/patient-icon.svg"
                alt="Patient"
                width={64}
                height={64}
                className="dark:invert"
              />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
              For Patients
            </h2>
            <ul className="space-y-3 mb-8 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Book appointments online
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                View medical history
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Secure health records
              </li>
            </ul>
            <Link
              href="/auth/register"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition duration-150"
            >
              Register as Patient
            </Link>
          </div>

          {/* Doctor Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/doctor-icon.svg"
                alt="Doctor"
                width={64}
                height={64}
                className="dark:invert"
              />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
              For Doctors
            </h2>
            <ul className="space-y-3 mb-8 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Manage appointments
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Access patient records
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Schedule availability
              </li>
            </ul>
            <Link
              href="/auth/register?role=doctor"
              className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition duration-150"
            >
              Register as Doctor
            </Link>
          </div>
        </main>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Already have an account?
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-150"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
