"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { useUpdateContactRequestStatus } from "@/src/services/contact-requests.service";
import type {
  ContactRequestDetails,
  UpdateContactRequestData,
  ContactRequestStatus,
} from "@/src/types/contact-request.type";

export const RequestRowActions: React.FC<{ request: ContactRequestDetails; onOpen: () => void }> = ({
  request,
  onOpen,
}) => {
  const update = useUpdateContactRequestStatus();

  const setStatus = (status: ContactRequestStatus) => {
    const updateData: UpdateContactRequestData = { status };
    update.mutate({ id: request.id, updateData });
  };

  return (
    <div className='flex items-center gap-2'>
      <Button variant='outline' size='sm' onClick={onOpen}>
        View
      </Button>
      <Button variant='outline' size='sm' onClick={() => setStatus("replied" as ContactRequestStatus)}>
        Mark Replied
      </Button>
      <Button variant='outline' size='sm' onClick={() => setStatus("closed" as ContactRequestStatus)}>
        Close
      </Button>
    </div>
  );
};
