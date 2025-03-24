import { useEffect } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAuthenticated } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your credentials to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);
  
  return <>{children}</>;
}
