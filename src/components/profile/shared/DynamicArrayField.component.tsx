"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";

interface DynamicArrayFieldProps {
  value: string[];
  onChange: (newValue: string[]) => void;
  placeholder: string;
  description?: string;
  maxItems?: number;
  allowDuplicates?: boolean;
}

export function DynamicArrayField({
  value = [],
  onChange,
  placeholder,
  description,
  maxItems,
  allowDuplicates = false,
}: DynamicArrayFieldProps) {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (!inputValue.trim()) return;

    const trimmedValue = inputValue.trim();

    // Check for duplicates if not allowed
    if (!allowDuplicates && value.includes(trimmedValue)) {
      return;
    }

    // Check max items
    if (maxItems && value.length >= maxItems) {
      return;
    }

    onChange([...value, trimmedValue]);
    setInputValue("");
  };

  const removeItem = (itemToRemove: string) => {
    onChange(value.filter((item) => item !== itemToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const canAdd =
    inputValue.trim() &&
    (allowDuplicates || !value.includes(inputValue.trim())) &&
    (!maxItems || value.length < maxItems);

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
          className='flex-1'
        />
        <Button type='button' onClick={addItem} disabled={!canAdd} className='flex items-center gap-2 px-4'>
          <PlusIcon className='h-4 w-4' weight='bold' />
          Add
        </Button>
      </div>

      {value.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {value.map((item, index) => (
            <Badge key={index} variant='secondary' className='flex items-center gap-2 px-3 py-1'>
              {item}
              <button
                type='button'
                onClick={() => removeItem(item)}
                className='text-neutral-500 hover:text-destructive'
              >
                <TrashIcon className='h-3 w-3' weight='bold' />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {description && <p className='text-xs text-neutral-500'>{description}</p>}
    </div>
  );
}
