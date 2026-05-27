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

export const formatDateDisplay = (
  dateString,
  format = 'short',
  countryCode = 'en-IN'
) => {
  if (!dateString) return '- ';

  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  if (format === 'short') {
    return date.toLocaleDateString(countryCode, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  if (format === 'dd/mm/yyyy') {
    return date.toLocaleDateString(countryCode, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }

  if (format === 'long') {
    return date.toLocaleDateString(countryCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (format === 'calender') {
    return date
      .toLocaleDateString(countryCode, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');
  }
};

export const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getExt = (name) => name.split('.').pop()?.toLowerCase() || 'file';
