import React, { useEffect } from 'react';
import Button from './Button.jsx';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  size = 'md',
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {actions.length > 0 && (
          <div className="modal-footer">
            {actions.map((action) => (
              <Button
                key={action.label}
                label={action.label}
                variant={action.variant || 'primary'}
                onClick={action.onClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
