import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "link";
  isSmall?: boolean;
  isOutline?: boolean;
}

/**
 * OAT-styled Button
 * Renders a native button element styled by OAT CSS.
 */
export const Button: React.FC<ButtonProps> = ({ 
  variant, 
  isSmall, 
  isOutline, 
  className = "", 
  children, 
  ...props 
}) => {
  const classes = [
    className,
    isSmall ? "small" : "",
    isOutline ? "outline" : "",
  ].filter(Boolean).join(" ");

  return (
    <button 
      data-variant={variant} 
      className={classes || undefined}
      {...props}
    >
      {children}
    </button>
  );
};
