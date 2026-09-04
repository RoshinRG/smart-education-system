import React from 'react';

export default function Card({
  title,
  children,
  className = '',
  onClick,
  hoverable = false,
  ...props
}) {
  return (
    <div
      className={`card ${hoverable ? 'hoverable' : ''} ${className}`.trim()}
      onClick={onClick}
      style={onClick || hoverable ? { cursor: 'pointer' } : undefined}
      {...props}
    >
      {title && (
        <div className="card-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}
