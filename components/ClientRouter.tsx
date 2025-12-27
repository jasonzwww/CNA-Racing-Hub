
'use client';

import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * A wrapper that only renders the BrowserRouter on the client.
 * This satisfies react-router-dom hooks in shared components while 
 * avoiding Next.js SSR mismatch errors.
 */
export default function ClientRouter({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}
