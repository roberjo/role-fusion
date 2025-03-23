import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RoleProvider } from '../components/RoleProvider';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import { MockAuthProvider } from './MockAuthProvider';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const PortalContainer = () => {
  return <div id="portal-root" />;
};

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <>
      <PortalContainer />
      <ToastProvider>
        <TooltipProvider>
          <RoleProvider
            roles={{
              admin: { permissions: ['*'] },
              user: { permissions: ['users.view'] }
            }}
            initialRole="user"
          >
            <MockAuthProvider>
              <ThemeProvider defaultTheme="light">
                {children}
              </ThemeProvider>
            </MockAuthProvider>
          </RoleProvider>
          <ToastViewport />
        </TooltipProvider>
      </ToastProvider>
    </>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  window.history.pushState({}, 'Test page', '/');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AllTheProviders>
            {ui}
          </AllTheProviders>
        </BrowserRouter>
      </QueryClientProvider>,
      options
    ),
    queryClient,
  };
};

export * from '@testing-library/react';
export { customRender as render }; 