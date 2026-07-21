import React from 'react';

export default function Button({ children, variant = 'primary', className = '', block = false, size = 'md', ...props }) {
  const baseClass = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const blockClass = block ? 'btn-block' : '';
  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button 
      className={[baseClass, variantClass, blockClass, sizeClass, className].filter(Boolean).join(' ')} 
      {...props}
    >
      {children}
    </button>
  );
}
