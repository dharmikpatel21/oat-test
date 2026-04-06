import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * OAT-styled Input
 * Leverages OAT's native element styling and utility classes.
 */
export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  id, 
  className = "", 
  ...props 
}) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div data-field={error ? "error" : undefined}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input 
        id={inputId} 
        className={className} 
        {...props} 
      />
      {error && <div className="error" role="status">{error}</div>}
    </div>
  );
};
