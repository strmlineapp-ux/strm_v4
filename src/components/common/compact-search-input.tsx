import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { GoogleSymbol } from '../icons/google-symbol';
import { cn, getHueFromHsl } from '../../lib/utils';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface CompactSearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  tooltipText?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  showColorFilter?: boolean;
  onColorSelect?: (color: string | null) => void;
  activeColorFilter?: string | null;
  isActive?: boolean;
}

export function CompactSearchInput({ 
  searchTerm, 
  setSearchTerm, 
  placeholder = "Search...", 
  className,
  autoFocus,
  tooltipText,
  inputRef: passedInputRef,
  showColorFilter,
  onColorSelect,
  activeColorFilter,
  isActive = false
}: CompactSearchInputProps) {
  const [isSearching, setIsSearching] = useState(!!autoFocus || isActive);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = passedInputRef || (internalInputRef as React.RefObject<HTMLInputElement>);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isColorPopoverOpen, setIsColorPopoverOpen] = useState(false);

  useEffect(() => {
    if (autoFocus || isActive) {
      setIsSearching(true);
    }
  }, [autoFocus, isActive]);

  useEffect(() => {
    if (isSearching && inputRef.current) {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
    }
  }, [isSearching, inputRef]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isActive) return;

      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!searchTerm && !isColorPopoverOpen) {
          setIsSearching(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchTerm, isColorPopoverOpen, isActive]);

  const handleColorPopoverChange = (isOpen: boolean) => {
      setIsColorPopoverOpen(isOpen);
      if (!isOpen && !searchTerm) {
          setIsSearching(false);
      }
  }

  const handleToggle = () => {
    setIsSearching(prev => !prev);
  }
  
  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onColorSelect) {
        const hue = e.target.value;
        onColorSelect(`hsl(${hue}, 100%, 50%)`);
    }
  };
  
  const handleClearColorFilter = () => {
    if(onColorSelect) {
      onColorSelect(null);
    }
    setIsColorPopoverOpen(false);
  }

  const currentHue = getHueFromHsl(activeColorFilter) || 0;

  if (isSearching) {
    return (
      <div 
        ref={containerRef}
        className={cn("flex items-center gap-1 w-full rounded-full h-8 px-2 text-sm bg-muted/50", className)}
      >
        <GoogleSymbol name="search" className="text-foreground text-[18px]" />
        <input
          ref={inputRef}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 w-full h-full p-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none border-none outline-none"
        />
        {showColorFilter && onColorSelect && (
            <Popover open={isColorPopoverOpen} onOpenChange={handleColorPopoverChange}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-transparent">
                        <GoogleSymbol name={activeColorFilter ? "radio_button_checked" : "radio_button_unchecked"} style={{ color: activeColorFilter || 'hsl(var(--foreground))' }} className="text-[18px]" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" onPointerDownCapture={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={currentHue}
                            onChange={handleHueChange}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-0 hue-gradient-track"
                        />
                        <Button
                          variant="ghost" 
                          size="icon" 
                          className="w-auto h-auto px-1 hover:text-destructive"
                          onClick={handleClearColorFilter}
                        >
                            <GoogleSymbol name="cancel" className="text-[20px]" />
                            <span className="sr-only">Clear Color Filter</span>
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        )}
      </div>
    );
  }

  const searchButton = (
    <Button variant="ghost" size="icon" onClick={handleToggle} className="text-foreground rounded-full h-8 w-8 font-emphasis">
      <GoogleSymbol name="search" className="text-[20px]" />
    </Button>
  );

  if (tooltipText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {searchButton}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  return searchButton;
}
