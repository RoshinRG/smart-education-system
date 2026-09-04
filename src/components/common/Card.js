import { createElement as h } from '../../utils/h.js';

export default function Card({ 
  title, 
  children, 
  className = '',
  onClick,
  hoverable = false,
  ...props 
}) {
  return h('div', {
    className: `card ${hoverable ? 'hoverable' : ''} ${className}`,
    onClick,
    ...props,
  }, [
    title && h('div', { className: 'card-header' }, [
      h('h3', {}, title),
    ]),
    h('div', { className: 'card-body' }, children),
  ]);
}
