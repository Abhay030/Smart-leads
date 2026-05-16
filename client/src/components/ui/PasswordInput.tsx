import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          label={label}
          error={error}
          icon={<Lock className="h-4 w-4" />}
          className={className}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 ${label ? 'top-9' : 'top-3'} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
