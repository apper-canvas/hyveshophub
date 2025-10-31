import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  padding = "default",
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = "bg-white rounded-lg border border-secondary-200 transition-all duration-200";
  
  const variants = {
    default: "shadow-sm",
    elevated: "shadow-md",
    outline: "border-2 border-secondary-200 shadow-none",
    glass: "glass shadow-lg"
  };

  const paddings = {
    none: "",
    sm: "p-3",
    default: "p-4",
    lg: "p-6",
    xl: "p-8"
  };

  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        paddings[padding],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;