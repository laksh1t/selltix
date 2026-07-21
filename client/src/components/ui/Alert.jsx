import React from 'react';

export default function Alert({ type = 'error', children }) {
  if (!children) return null;
  const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
  return (
    <div className={`alert ${alertClass}`}>
      {children}
    </div>
  );
}
