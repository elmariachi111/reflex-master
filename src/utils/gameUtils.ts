export const generateRandomDelay = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const formatTime = (time: number | null): string => {
  if (time === null) return '-';
  return `${time} ms`;
};

export const calculateAverage = (times: number[]): number | null => {
  if (times.length === 0) return null;
  const sum = times.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / times.length);
};

export const getBestTime = (times: number[]): number | null => {
  if (times.length === 0) return null;
  return Math.min(...times);
};

export const getTimeColor = (time: number | null): string => {
  if (time === null) return 'text-gray-400';
  if (time < 200) return 'text-green-600';
  if (time < 300) return 'text-blue-600';
  if (time < 400) return 'text-yellow-500';
  return 'text-red-500';
};

export const getReactionMessage = (time: number | null): string => {
  if (time === null) return 'Click to start';
  if (time < 200) return 'Lightning fast!';
  if (time < 300) return 'Excellent!';
  if (time < 400) return 'Good job!';
  if (time < 500) return 'Not bad';
  return 'Keep practicing';
};