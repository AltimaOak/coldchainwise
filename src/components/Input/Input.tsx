import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            block w-full rounded-input border text-sm transition-all focus:ring-4 focus:outline-none smooth-hover
            ${icon ? 'pl-10' : 'pl-3'}
            ${error 
              ? 'border-error-custom text-red-900 placeholder-red-300 focus:ring-error-custom/15 focus:border-error-custom bg-red-50/50' 
              : 'border-[#D6D3D1] text-text-primary placeholder-slate-400 focus:ring-primary-brand/15 focus:border-primary-brand bg-white hover:border-slate-450'
            }
            py-2 px-3
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-xs text-danger font-medium mt-0.5" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
