import { cn } from "@/src/helpers/tailwind.helper";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";
import {
  FloppyDiskIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  CpuIcon,
  HourglassHighIcon,
  ArrowsClockwiseIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";

interface ContextualLoaderProps {
  action: LoadingAction;
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
  size?: SpinnerSize;
  className?: string;
  iconClassName?: string;
}

interface InlineLoaderProps {
  action: LoadingAction;
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses = {
  [SpinnerSize.SMALL]: "h-4 w-4",
  [SpinnerSize.MEDIUM]: "h-6 w-6",
  [SpinnerSize.LARGE]: "h-8 w-8",
  [SpinnerSize.EXTRA_LARGE]: "h-12 w-12",
};

const actionConfig = {
  [LoadingAction.SAVING]: {
    icon: FloppyDiskIcon,
    defaultTitle: "Saving...",
    animation: "animate-pulse",
    ariaLabel: "Saving data",
  },
  [LoadingAction.UPLOADING]: {
    icon: CloudArrowUpIcon,
    defaultTitle: "Uploading...",
    animation: "animate-bounce",
    ariaLabel: "Uploading file",
  },
  [LoadingAction.SEARCHING]: {
    icon: MagnifyingGlassIcon,
    defaultTitle: "Searching...",
    animation: "animate-scanning",
    ariaLabel: "Searching data",
  },
  [LoadingAction.PROCESSING]: {
    icon: CpuIcon,
    defaultTitle: "Processing...",
    animation: "animate-processing",
    ariaLabel: "Processing data",
  },
  [LoadingAction.LOADING]: {
    icon: HourglassHighIcon,
    defaultTitle: "Loading...",
    animation: "animate-flip",
    ariaLabel: "Loading content",
  },
  [LoadingAction.SYNCING]: {
    icon: ArrowsClockwiseIcon,
    defaultTitle: "Syncing...",
    animation: "animate-spin",
    ariaLabel: "Syncing data",
  },
  [LoadingAction.DOWNLOADING]: {
    icon: DownloadSimpleIcon,
    defaultTitle: "Downloading...",
    animation: "animate-bounce",
    ariaLabel: "Downloading file",
  },
};

// Compact inline loader for buttons and forms
export const InlineLoader = ({ action, size = SpinnerSize.SMALL, className }: InlineLoaderProps) => {
  const config = actionConfig[action];
  const IconComponent = config.icon;

  return (
    <IconComponent
      className={cn(sizeClasses[size], "text-current", config.animation, className)}
      weight='bold'
      aria-label={config.ariaLabel}
      role='img'
    />
  );
};

export const Loader = ({
  action,
  title,
  subtitle,
  fullScreen = true,
  size = SpinnerSize.LARGE,
  className,
  iconClassName,
}: ContextualLoaderProps) => {
  const config = actionConfig[action];
  const IconComponent = config.icon;
  const displayTitle = title || config.defaultTitle;

  const containerClass = fullScreen
    ? "min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-accent-50/10 flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={cn(containerClass, className)}>
      <div className='text-center'>
        {/* Animated icon container */}
        <div className='relative mb-6'>
          {/* Subtle glow effect */}
          <div className='absolute inset-0 blur-xl opacity-30 flex justify-center'>
            <IconComponent className={cn(sizeClasses[size], "text-primary-600", config.animation)} weight='bold' />
          </div>

          {/* Main animated icon */}
          <div className='relative flex justify-center'>
            <IconComponent
              className={cn(sizeClasses[size], "text-primary-600", config.animation, iconClassName)}
              weight='bold'
              aria-label={config.ariaLabel}
              role='img'
            />
          </div>
        </div>

        {/* Text content */}
        <div className='space-y-2'>
          <h2 className='text-lg font-semibold text-neutral-900 tracking-tight'>{displayTitle}</h2>
          {subtitle && <p className='text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed'>{subtitle}</p>}
        </div>

        {/* Subtle animated dots */}
        <div className='flex justify-center mt-4 space-x-1'>
          <div className='w-1 h-1 bg-neutral-400 rounded-full animate-pulse' style={{ animationDelay: "0ms" }} />
          <div className='w-1 h-1 bg-neutral-400 rounded-full animate-pulse' style={{ animationDelay: "200ms" }} />
          <div className='w-1 h-1 bg-neutral-400 rounded-full animate-pulse' style={{ animationDelay: "400ms" }} />
        </div>
      </div>
    </div>
  );
};
