
import React from 'react';

interface PageTitleProps {
  pathname: string;
}

export function PageTitle({ pathname }: PageTitleProps) {
  // Determine the title based on the pathname
  const getTitle = (path: string) => {
    if (path === "/") return "Dashboard";
    
    // Convert pathname like "/user-management" to "User Management"
    return path.split("/").pop()?.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ") || "Dashboard";
  };

  const title = getTitle(pathname);

  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">
        Enterprise Management System
      </span>
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
