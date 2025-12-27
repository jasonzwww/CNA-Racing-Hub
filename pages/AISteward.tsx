
import React from 'react';
import { useRouter } from 'next/navigation';

const AISteward: React.FC = () => {
  const router = useRouter();
  if (typeof window !== 'undefined') {
    router.push('/');
  }
  return null;
};

export default AISteward;
