import React, { useState, useRef, useEffect, useCallback } from 'react';

interface InlineEditorProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function InlineEditor({
  value,
  onSave,
  className = "",
  placeholder = "Click to edit...",
  disabled = false,
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state if external value prop updates natively via Firestore
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = useCallback(() => {
    if (currentValue.trim() !== value.trim()) {
      onSave(currentValue.trim());
    }
    setIsEditing(false);
  }, [currentValue, value, onSave]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Critical: Stops Dnd-Kit sensors from capturing the keyboard inputs!
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      // Prevents dragging logic if user just clicks to edit
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        onPointerDown={(e) => e.stopPropagation()} // Overrides outer pointer interactions entirely
        className={`bg-transparent outline-none m-0 p-0 border-b border-primary border-dashed focus:border-solid ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      onPointerDown={!disabled ? (e) => e.stopPropagation() : undefined} 
      className={`cursor-text transition-colors hover:text-primary ${!value ? "italic text-muted-foreground" : ""} ${className}`}
    >
      {value || placeholder}
    </span>
  );
}
