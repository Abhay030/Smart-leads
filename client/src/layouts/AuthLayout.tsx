import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Auth Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 bg-white dark:bg-gray-950">
        <div className="absolute top-4 right-4 lg:right-1/2 lg:mr-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Outlet />
        </div>
      </div>
      
      {/* Right side - Image/Branding */}
      <div className="hidden lg:relative lg:block lg:w-1/2 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <div className="h-20 w-20 rounded-2xl bg-brand-600 mb-8 flex items-center justify-center shadow-xl shadow-brand-500/20">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Smart Leads Dashboard
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-md">
            The professional solution for managing, filtering, and converting your sales pipeline faster than ever.
          </p>
        </div>
      </div>
    </div>
  );
};
