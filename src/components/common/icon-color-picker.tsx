import React, { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { GoogleSymbol } from '../icons/google-symbol';
import { ScrollArea } from '../ui/scroll-area';
import { googleSymbolNames } from '../../lib/google-symbols';
import { CompactSearchInput } from './compact-search-input';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { HslStringColorPicker } from 'react-colorful';
import { getReadableColor } from '../../lib/utils';
import { useAuth } from '../../hooks/use-auth';

export const PREDEFINED_COLORS = [
    'hsl(0, 84%, 60%)', 'hsl(25, 95%, 53%)', 'hsl(45, 93%, 47%)', 'hsl(88, 62%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(160, 100%, 37%)',
    'hsl(174, 100%, 34%)', 'hsl(188, 95%, 43%)', 'hsl(207, 90%, 54%)', 'hsl(221, 83%, 61%)', 'hsl(244, 100%, 72%)', 'hsl(262, 88%, 66%)',
    'hsl(271, 91%, 65%)', 'hsl(328, 84%, 60%)', 'hsl(347, 89%, 61%)', 'hsl(358, 86%, 56%)'
];

// Note: In V4 we prioritize this specific subset, though more could be loaded dynamically if needed.
const mostUsedIcons = [
    'group', 'calendar_month', 'checklist', 'style', 'push_pin', 'desktop_windows',
    'file_copy', 'shield', 'settings', 'web', 'tab', 'person', 'category', 'numbers',
    'stars', 'fitness_center', 'movie', 'podcasts', 'campaign', 'business_center', 'edit'
];

interface IconColorPickerProps {
  icon: string;
  color: string;
  onUpdateIcon: (icon: string) => void;
  onUpdateColor: (color: string) => void;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function IconColorPicker({ icon, color, onUpdateIcon, onUpdateColor, disabled, onClick }: IconColorPickerProps) {
  const { viewAsUser, currentUser } = useAuth();
  const [isIconPopoverOpen, setIsIconPopoverOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  const sortedIcons = useMemo(() => {
    const iconSet = new Set(googleSymbolNames);
    const priorityIcons = mostUsedIcons.filter(i => iconSet.has(i));
    const otherIcons = googleSymbolNames.filter(i => !mostUsedIcons.includes(i));
    return [...priorityIcons, ...otherIcons];
  }, []);

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return sortedIcons;
    return sortedIcons.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch, sortedIcons]);
  
  const handleColorSwatchClick = (newColor: string) => {
    onUpdateColor(newColor);
    setIsIconPopoverOpen(false); // Close the main popover as well
  };
  
  const readableColor = getReadableColor(color, currentUser?.theme);
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
        onClick(e);
    }
  };

  return (
    <Popover open={isIconPopoverOpen} onOpenChange={setIsIconPopoverOpen}>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild onPointerDown={(e) => e.stopPropagation()} disabled={disabled}>
                        <Button variant="ghost" size="xlarge" className="h-10 w-12 font-emphasis hover:bg-transparent" onClick={handleClick}>
                            <GoogleSymbol 
                              name={icon} 
                              style={{ fontSize: '36px', color: readableColor }} 
                              weight={viewAsUser?.fontWeight} 
                              grade={viewAsUser?.iconGrade} 
                            />
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Change Icon</p></TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-auto p-0 flex shadow-lg" onPointerDown={(e) => e.stopPropagation()} onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="w-80 flex-1 p-1 flex flex-col">
                <div className="flex items-center justify-between p-1">
                    <CompactSearchInput
                        searchTerm={iconSearch}
                        setSearchTerm={setIconSearch}
                        placeholder="Search icons..."
                        autoFocus={true}
                        isActive={true}
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 ml-2"
                                    onClick={() => setIsColorPickerVisible(!isColorPickerVisible)}
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <GoogleSymbol name="palette" style={{color: color}} className="text-[20px]" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Change Color</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <ScrollArea className="h-52">
                    <div className="grid grid-cols-6 gap-2 p-2">
                        {filteredIcons.slice(0, 300).map((iconName) => {
                            const isSelected = icon === iconName;
                            return (
                                <TooltipProvider key={iconName}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                data-state={isSelected ? 'active' : 'inactive'}
                                                onClick={() => {
                                                    onUpdateIcon(iconName);
                                                    setIsIconPopoverOpen(false);
                                                }}
                                                className="h-10 w-10 p-0 font-emphasis rounded-md"
                                            >
                                                <GoogleSymbol
                                                    name={iconName}
                                                    className="text-[28px]"
                                                    style={{ color: readableColor }}
                                                    weight={100}
                                                />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>{iconName}</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
            {isColorPickerVisible && (
                <>
                    <div className="w-[1px] bg-border my-2" />
                    <div className="w-[200px] p-4 space-y-4 flex flex-col justify-center bg-card rounded-r-md">
                        <HslStringColorPicker
                            color={color}
                            onChange={onUpdateColor}
                            className="!w-full"
                        />
                        <div className="grid grid-cols-8 gap-1.5 pt-2 border-t border-border mt-2">
                            {PREDEFINED_COLORS.map((c) => (
                                <button
                                    key={c}
                                    className="h-5 w-5 rounded-full border border-border shadow-sm transition-transform cursor-pointer"
                                    style={{ backgroundColor: c }}
                                    onClick={() => handleColorSwatchClick(c)}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </PopoverContent>
    </Popover>
  );
}
