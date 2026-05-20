import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = (isoString) => {
  if (!isoString) return '- ';

  const newDate = new Date(isoString).toLocaleDateString({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return newDate;
};

export const formatDateDisplay = (dateString) => {
  if (!dateString) return '- ';

  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
