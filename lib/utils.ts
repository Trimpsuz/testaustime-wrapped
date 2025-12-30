import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isStringNull = (text: string | null | undefined) => !text || text.toLowerCase() === 'null' || text.toLowerCase() === 'undefined' || text.trim() === '';

export const capitalizeFirstLetter = (text: string) => text[0].toUpperCase() + text.slice(1);

export const dayLabels = [
  '00:00 – 01:00',
  '01:00 – 02:00',
  '02:00 – 03:00',
  '03:00 – 04:00',
  '04:00 – 05:00',
  '05:00 – 06:00',
  '06:00 – 07:00',
  '07:00 – 08:00',
  '08:00 – 09:00',
  '09:00 – 10:00',
  '10:00 – 11:00',
  '11:00 – 12:00',
  '12:00 – 13:00',
  '13:00 – 14:00',
  '14:00 – 15:00',
  '15:00 – 16:00',
  '16:00 – 17:00',
  '17:00 – 18:00',
  '18:00 – 19:00',
  '19:00 – 20:00',
  '20:00 – 21:00',
  '21:00 – 22:00',
  '22:00 – 23:00',
  '23:00 – 24:00',
];

export const weekLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const yearLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
