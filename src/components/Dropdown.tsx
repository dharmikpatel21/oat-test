import React from "react";

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
}

/**
 * OAT-styled Dropdown
 * Standard native select wrapped in an OAT-styled dropdown container.
 */
export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  id,
  children,
  className = "",
  ...props
}) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div data-field>
      {label && <label htmlFor={selectId}>{label}</label>}
      <select id={selectId} className={className} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </div>
  );
};
