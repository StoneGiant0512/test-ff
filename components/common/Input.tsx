'use client';

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
              <div className="text-gray-400 flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
          <input
            ref={ref}
            className={`w-full py-3 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'
            } ${icon ? 'pl-11 pr-4' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
        {helperText && !error && <p className="text-gray-500 text-xs mt-1.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

