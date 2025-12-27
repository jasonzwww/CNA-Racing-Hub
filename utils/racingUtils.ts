
export const formatIRacingTime = (ticks: number): string => {
  if (ticks === -1 || !ticks) return "--:--.---";
  const totalSeconds = ticks / 10000;
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, '0')}`;
};

export const formatInterval = (ticks: number): string => {
  if (ticks === 0) return "LEADER";
  if (ticks < 0) return "LAPPED";
  const seconds = (ticks / 10000).toFixed(3);
  return `+${seconds}s`;
};

export const getCarBrandLogo = (carName: string): string => {
  const name = carName.toLowerCase();
  if (name.includes('ferrari')) return 'https://www.car-logos.org/wp-content/uploads/2011/09/ferrari.png';
  if (name.includes('porsche')) return 'https://www.car-logos.org/wp-content/uploads/2011/09/porsche.png';
  if (name.includes('bmw')) return 'https://www.car-logos.org/wp-content/uploads/2011/09/bmw.png';
  if (name.includes('mercedes')) return 'https://www.car-logos.org/wp-content/uploads/2011/09/mercedes.png';
  if (name.includes('corvette') || name.includes('chevrolet')) return 'https://www.car-logos.org/wp-content/uploads/2011/09/chevrolet.png';
  if (name.includes('aston martin')) return 'https://www.car-logos.org/wp-content/uploads/2011/09/aston_martin.png';
  if (name.includes('audi')) return 'https://www.car-logos.org/wp-content/uploads/2011/09/audi.png';
  if (name.includes('lamborghini')) return 'https://www.car-logos.org/wp-content/uploads/2011/09/lamborghini.png';
  return 'https://ir-racing.s3.amazonaws.com/marketing/Logos/iRacing-Logo-Small.png'; 
};

/**
 * Formats an ISO date string to user's local readable format
 */
export const formatLocalFull = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatLocalTimeOnly = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatLocalDateOnly = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
};
