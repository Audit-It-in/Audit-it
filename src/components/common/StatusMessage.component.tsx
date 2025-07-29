import { cn } from "@/src/helpers/tailwind.helper";
import { CheckCircleIcon, XCircleIcon, WarningIcon } from "@phosphor-icons/react";
import { StatusMessage as StatusMessageType, StatusMessageType as MessageType } from "@/src/types/common.type";

interface StatusMessageProps {
  message: StatusMessageType;
  className?: string;
  onDismiss?: () => void;
}

export const StatusMessage = ({ message, className, onDismiss }: StatusMessageProps) => {
  const variants = {
    [MessageType.ERROR]: {
      container: "bg-red-50/80 border border-red-200/60 text-red-700",
      icon: <XCircleIcon className='h-4 w-4 text-red-500' weight='fill' />,
    },
    [MessageType.INFO]: {
      container: "bg-blue-50/80 border border-blue-200/60 text-blue-700",
      icon: <CheckCircleIcon className='h-4 w-4 text-blue-500' weight='fill' />,
    },
    [MessageType.SUCCESS]: {
      container: "bg-green-50/80 border border-green-200/60 text-green-700",
      icon: <CheckCircleIcon className='h-4 w-4 text-green-500' weight='fill' />,
    },
    [MessageType.WARNING]: {
      container: "bg-yellow-50/80 border border-yellow-200/60 text-yellow-700",
      icon: <WarningIcon className='h-4 w-4 text-yellow-500' weight='fill' />,
    },
  };

  const variant = variants[message.type];

  return (
    <div className={cn("px-6 pb-2", className)}>
      <div className={cn("p-4 rounded-xl text-sm flex items-start gap-3 relative", variant.container)}>
        {variant.icon}
        <span className='flex-1'>{message.text}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className='text-current opacity-60 hover:opacity-100 transition-opacity'
            aria-label='Dismiss message'
          >
            <XCircleIcon className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  );
};
