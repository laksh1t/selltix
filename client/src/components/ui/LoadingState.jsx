import React from 'react';

export default function LoadingState({ message = 'Loading...' }) {
  return <p className="spinner-text">{message}</p>;
}
