import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_CONFIG } from './constants';

const env = process.env.NODE_ENV;

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An error occurred';
  toast.error(message);
};

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: API_CONFIG.STALE_TIME[env as keyof typeof API_CONFIG.STALE_TIME],
    retry: API_CONFIG.RETRY_COUNT[env as keyof typeof API_CONFIG.RETRY_COUNT],
    refetchOnWindowFocus: env === 'production',
  },
  mutations: {
    onError: handleError,
  },
};

export const queryClient = new QueryClient({ defaultOptions });

// Global error handler
queryClient.setDefaultOptions({
  queries: {
    onError: handleError,
  },
});

export function getQueryData<T>(key: string[]): T | undefined {
  try {
    return queryClient.getQueryData<T>(key);
  } catch (error) {
    console.error('Error getting query data:', error);
    return undefined;
  }
}

export function setQueryData<T>(key: string[], data: T): void {
  try {
    queryClient.setQueryData(key, data);
  } catch (error) {
    console.error('Error setting query data:', error);
    toast.error('Failed to update data');
  }
}

export function invalidateQueries(key: string[]): void {
  try {
    queryClient.invalidateQueries({ queryKey: key });
  } catch (error) {
    console.error('Error invalidating queries:', error);
  }
}

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