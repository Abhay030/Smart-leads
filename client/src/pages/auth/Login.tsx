import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setApiError(null);
      const response = await authApi.login(data);
      if (response.data) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoading(true);
      setApiError(null);
      const response = await authApi.demoLogin();
      if (response.data) {
        demoLogin(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to launch demo. Please try again.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email to sign in to your account
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

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Sign up
        </Link>
      </p>

      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-white px-6 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            For Recruiters & Evaluators
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-3 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-brand-200 bg-brand-50/50 hover:bg-brand-50 text-brand-700 dark:border-brand-900/50 dark:bg-brand-900/10 dark:hover:bg-brand-900/30 dark:text-brand-300" 
          onClick={handleDemoLogin}
          isLoading={isDemoLoading}
          disabled={isSubmitting}
        >
          Explore Demo Workspace
        </Button>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-relaxed">
          Explore a pre-populated demo workspace to experience the platform instantly.
        </p>
      </div>
    </div>
  );
};
