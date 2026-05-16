import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User as UserIcon, AlertCircle } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'sales',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setApiError(null);
      const response = await authApi.register(data);
      if (response.data) {
        // Auto-login after successful registration
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Create an account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your details below to create your account
        </p>
      </div>

      {apiError && (
        <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          icon={<UserIcon className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50 transition-colors">
              <input
                type="radio"
                value="sales"
                className="peer sr-only"
                {...register('role')}
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                    Sales User
                  </span>
                  <span className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    Manage leads and statuses
                  </span>
                </span>
              </span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white peer-checked:border-[6px] peer-checked:border-brand-600 dark:border-gray-600 dark:bg-gray-800 dark:peer-checked:border-brand-500"></div>
            </label>
            
            <label className="relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50 transition-colors">
              <input
                type="radio"
                value="admin"
                className="peer sr-only"
                {...register('role')}
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                    Administrator
                  </span>
                  <span className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    Full access and deletion
                  </span>
                </span>
              </span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white peer-checked:border-[6px] peer-checked:border-brand-600 dark:border-gray-600 dark:bg-gray-800 dark:peer-checked:border-brand-500"></div>
            </label>
          </div>
          {errors.role?.message && (
            <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
