import React from "react";
import clsx from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  color?: "gray" | "blue" | "green" | "red" | "yellow";
  className?: string;
};

export default function Badge({ children, color = "gray", className }: BadgeProps) {
  const baseStyle =
    "inline-block text-xs font-semibold px-2 py-1 rounded-full";

  const colorStyle = {
    gray: "bg-gray-200 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={clsx(baseStyle, colorStyle[color], className)}>
      {children}
    </span>
  );
}