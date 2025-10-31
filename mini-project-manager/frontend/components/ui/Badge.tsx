import React from "react";

type Variant = "success" | "warning" | "info" | "neutral";

const variantMap: Record<Variant, string> = {
  success: "bg-green-100 text-green-700 border border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  info: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  neutral: "bg-slate-100 text-slate-700 border border-slate-200",
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${variantMap[variant]} ${className}`}>{children}</span>
  );
}


