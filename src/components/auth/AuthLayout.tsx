
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top gradient accent */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 w-full" />
      
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-10">
            <Link to="/" className="flex justify-center">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold text-2xl">
                E
              </div>
            </Link>
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          
          <div className="glass-panel p-6 sm:rounded-xl sm:px-10 sm:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
