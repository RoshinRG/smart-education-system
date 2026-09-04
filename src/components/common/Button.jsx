import React from 'react';

export default function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children || label}
    </button>
  );
}
