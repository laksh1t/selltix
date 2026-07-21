import React from 'react';

export default function Card({ children, padded = true, className = '' }) {
  const paddedClass = padded ? 'card-padded' : '';
  return (
    <div className={`card ${paddedClass} ${className}`}>
      {children}
    </div>
  );
}
