import React from 'react';
import Button from './Button';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '32px' }}>
      <Button 
        variant="secondary" 
        size="sm"
        disabled={!pagination.hasPreviousPage}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </Button>
      <span style={{ fontSize: '14px', alignSelf: 'center', margin: '0 8px', color: 'var(--text-muted)' }}>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <Button 
        variant="secondary" 
        size="sm"
        disabled={!pagination.hasNextPage}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
