
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AISteward: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, [router]);
  return null;
};

export default AISteward;
