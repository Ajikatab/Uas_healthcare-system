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
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Welcome to our healthcare management system
          </p>
        </header>

        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Image
                    src="/patient-icon.svg"
                    alt="Healthcare"
                    width={40}
                    height={40}
                    className="dark:invert"
                  />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">
                Welcome to Healthcare System
              </h2>
              <ul className="space-y-2 mb-6 text-gray-600 dark:text-gray-300 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Create an account as patient or doctor
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Book appointments after logging in
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Manage your healthcare records securely
                </li>
              </ul>
              <div className="space-y-3">
                <Link
                  href="/auth?action=login"
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                >
                  Login
                </Link>
                <Link
                  href="/auth?action=register"
                  className="block w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 text-center py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-150"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
