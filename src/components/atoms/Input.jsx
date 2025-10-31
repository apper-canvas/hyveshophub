import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  icon,
  iconPosition = "left",
  placeholder,
  required = false,
  ...props 
}, ref) => {
  const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-secondary-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={18} 
              className="text-secondary-400" 
            />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          className={cn(
            "input-focus w-full px-4 py-2.5 border border-secondary-300 rounded-lg bg-white text-secondary-900 placeholder-secondary-400",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
          placeholder={placeholder}
          {...props}
        />
        
        {icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={18} 
              className="text-secondary-400" 
            />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;