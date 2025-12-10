import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isStringNull = (text: string | null | undefined) => !text || text.toLowerCase() === 'null' || text.toLowerCase() === 'undefined' || text.trim() === '';

export const capitalizeFirstLetter = (text: string) => text[0].toUpperCase() + text.slice(1);
