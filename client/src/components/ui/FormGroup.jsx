import React from 'react';

export default function FormGroup({ label, hint, children, className = '' }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}
