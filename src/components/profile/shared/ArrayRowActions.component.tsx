"use client";

import { Button } from "@/src/components/ui/button";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";

interface ArrayRowActionsProps {
  canAdd: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export function ArrayRowActions({ canAdd, onAdd, onRemove }: ArrayRowActionsProps) {
  return (
    <div className='flex items-center justify-between gap-3 sm:col-span-2'>
      <Button type='button' variant='ghost' size='sm' className='text-red-600 hover:bg-red-50' onClick={onRemove}>
        <TrashIcon className='h-4 w-4' weight='bold' />
        Remove
      </Button>
      {canAdd && (
        <Button type='button' variant='outline' onClick={onAdd}>
          <PlusIcon className='h-4 w-4' weight='bold' />
          Add another
        </Button>
      )}
    </div>
  );
}
