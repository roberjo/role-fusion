import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { memoize } from "lodash"

export const cn = memoize((...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
})

export function formatPathToTitle(path: string): string {
  if (path === '/') return 'Dashboard';
  
  // Remove leading slash and split by hyphens
  const words = path.slice(1).split('-');
  
  // Capitalize first letter of each word
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
