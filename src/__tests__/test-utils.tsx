import { render, RenderOptions } from '@testing-library/react';
import { RoleProvider } from '../components/RoleProvider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleProvider
      roles={{
        admin: { permissions: ['users.view', 'users.edit', 'admin.access'] },
        user: { permissions: ['users.view'] }
      }}
      initialRole={{ name: "user", permissions: ['users.view'] }}
    >
      {children}
    </RoleProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };