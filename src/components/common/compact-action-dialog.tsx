import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import { GoogleSymbol } from '../icons/google-symbol';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface CompactActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  actionIcon: string;
  actionLabel: string;
  onAction: () => void;
  isDestructive?: boolean;
}

export function CompactActionDialog({
  open,
  onOpenChange,
  title,
  description,
  actionIcon,
  actionLabel,
  onAction,
  isDestructive = false
}: CompactActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" onPointerDownCapture={(e) => e.stopPropagation()}>
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`hover:bg-transparent ${isDestructive ? 'text-destructive' : 'text-primary/80'} p-0 h-6 w-6 font-emphasis`}
                  onClick={() => {
                    onAction();
                    onOpenChange(false);
                  }}
                >
                  <GoogleSymbol name={actionIcon} className="text-3xl" weight={200} />
                  <span className="sr-only">{actionLabel}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{actionLabel}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <DialogHeader className="pr-12">
          {/* Include a large, centered icon if it's destructive (standard pattern) */}
          {isDestructive && (
             <div className="flex justify-center mb-4">
                 <GoogleSymbol name={actionIcon} className="text-destructive text-6xl" weight={100} />
             </div>
          )}
          <DialogTitle className={isDestructive ? "text-center" : ""}>{title}</DialogTitle>
          <DialogDescription className={isDestructive ? "text-center" : ""}>
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
