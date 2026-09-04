import { createElement as h } from '../../utils/h.js';

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
  return h('button', {
    className: `btn btn-${variant} ${className}`,
    onClick,
    disabled,
    type,
    ...props,
  }, children || label);
}
