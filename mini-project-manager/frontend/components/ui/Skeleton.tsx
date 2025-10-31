import React from "react";

export default function Skeleton({ className = "h-4 w-full rounded-md" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}


