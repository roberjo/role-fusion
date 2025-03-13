
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md mx-auto glass-panel p-8 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-primary/5 p-4 rounded-full">
            <div className="text-5xl font-bold text-primary">404</div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground">
            We couldn't find the page you were looking for. It might have been
            removed or relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">Return to dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/data-grid">View data grid</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
