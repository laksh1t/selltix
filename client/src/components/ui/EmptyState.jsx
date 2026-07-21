import React from 'react';

export default function EmptyState({ message = 'No data to show.', children }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {children}
    </div>
  );
}
