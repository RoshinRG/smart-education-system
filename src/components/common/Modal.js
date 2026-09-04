import { createElement as h } from '../../utils/h.js';
import Button from './Button.js';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  actions = [],
  size = 'md',
}) {
  if (!isOpen) return null;

  return h('div', { className: 'modal-overlay', onClick: onClose }, [
    h('div', { 
      className: `modal modal-${size}`,
      onClick: (e) => e.stopPropagation(),
    }, [
      h('div', { className: 'modal-header' }, [
        h('h2', {}, title),
        h('button', { 
          className: 'modal-close',
          onClick: onClose,
        }, '×'),
      ]),
      h('div', { className: 'modal-body' }, children),
      actions.length > 0 && h('div', { className: 'modal-footer' }, [
        actions.map((action) =>
          h(Button, {
            key: action.label,
            label: action.label,
            variant: action.variant || 'primary',
            onClick: action.onClick,
          })
        ),
      ]),
    ]),
  ]);
}
