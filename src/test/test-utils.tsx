import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { RoleProvider } from '../components/RoleProvider';

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
          <RoleProvider
            roles={{
              admin: {
                permissions: ['users.create', 'users.edit', 'users.delete']
              },
              user: {
                permissions: ['users.view']
              }
            }}
            initialRole={{ name: "user", permissions: ['users.view'] }}
          >
            {children}
          </RoleProvider>
        </ThemeProvider>
      </BrowserRouter>
    ),
    ...options,
  });
}

// Re-export everything
export * from '@testing-library/react';
export { render }; 