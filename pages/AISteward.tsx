
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AISteward: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/');
  }, [navigate]);
  return null;
};

export default AISteward;
