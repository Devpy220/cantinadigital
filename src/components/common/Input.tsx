import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const inputClasses = `block px-4 py-2 rounded-md border ${
    error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
  } focus:outline-none focus:ring-2 ${widthClass} ${className}`;
  
  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label className="block text-gray-700 font-medium mb-1">{label}</label>
      )}
      <input className={inputClasses} {...props} />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;