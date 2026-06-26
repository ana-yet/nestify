'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
      <h2 className="text-2xl font-bold text-text-main mb-2">Something went wrong</h2>
      <p className="text-text-muted mb-6">An unexpected error occurred.</p>
      <button onClick={reset} className="btn btn-primary-nestify">
        Try again
      </button>
    </div>
  );
}
