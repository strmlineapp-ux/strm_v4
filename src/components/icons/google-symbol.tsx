import React from 'react';
import { cn } from "../../lib/utils";

type GoogleSymbolVariant = 'outlined' | 'rounded' | 'sharp';

export const GoogleSymbol = React.forwardRef<
  HTMLSpanElement,
  { 
    name: string; 
    className?: string; 
    weight?: number;
    grade?: number;
  } & React.HTMLAttributes<HTMLSpanElement>
>(({ name, className, weight, grade, ...props }, ref) => {
  const variantClass = 'material-symbols-outlined';

  const style: React.CSSProperties = { 
    ...props.style,
    fontVariationSettings: `'FILL' var(--global-icon-fill, 0), 'wght' ${weight ?? 'var(--global-icon-weight, 100)'}, 'GRAD' ${grade ?? 'var(--global-icon-grade, 0)'}, 'opsz' var(--global-icon-optical-size, 24)`
  };
  
  return (
    <span
      ref={ref}
      className={cn(variantClass, className)}
      style={style}
      {...props}
    >
      {name}
    </span>
  );
});
GoogleSymbol.displayName = 'GoogleSymbol';
