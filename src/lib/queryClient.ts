import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiError } from './api/client';

const handleError = (error: unknown) => {
  const apiError = error as ApiError;
  toast.error(apiError.message || 'An unexpected error occurred');
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      onError: handleError,
      retry: false,
    },
  },
});

// Utility function to invalidate queries by prefix
export const invalidateQueries = async (prefix: string): Promise<void> => {
  await queryClient.invalidateQueries({ queryKey: [prefix] });
};

// Utility function to prefetch queries
export const prefetchQuery = async <T>(
  key: string[],
  fetcher: () => Promise<T>,
): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: key,
    queryFn: fetcher,
  });
};

// Utility function to set query data directly
export const setQueryData = <T>(key: string[], data: T): void => {
  queryClient.setQueryData(key, data);
};

// Utility function to get query data
export const getQueryData = <T>(key: string[]): T | undefined => {
  return queryClient.getQueryData<T>(key);
}; 