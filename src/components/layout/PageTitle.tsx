
import React from 'react';

interface PageTitleProps {
  pathname: string;
}

export function PageTitle({ pathname }: PageTitleProps) {
  const title = pathname === "/" 
    ? "Dashboard" 
    : pathname.split("/").pop()?.split("-").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ") || "Dashboard";

  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">
        Enterprise Management System
      </span>
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
