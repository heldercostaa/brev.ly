import { WarningCircleIcon, XIcon } from '@phosphor-icons/react';
import * as ToastRadix from '@radix-ui/react-toast';

type ToastProps = {
  type: 'error' | 'information';
  title: string;
  description: string;
  duration?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Toast({
  type,
  title,
  description,
  duration = 5000,
  open,
  onOpenChange,
}: ToastProps) {
  const iconColor = type === 'error' ? 'var(--color-danger)' : 'var(--color-blue-base)';
  const textColor = type === 'error' ? 'text-danger' : 'text-blue-base';
  const backgroundColor = type === 'error' ? 'bg-[#f1d4da]' : 'bg-[#d6d8ef]';

  return (
    <ToastRadix.Provider swipeDirection="right">
      <ToastRadix.Root
        open={open}
        onOpenChange={onOpenChange}
        duration={duration}
        className={`flex w-180 max-w-[94vw] flex-row items-start justify-start gap-6 rounded-lg p-8 shadow-gray-300 shadow-lg ${backgroundColor}`}
      >
        <WarningCircleIcon color={iconColor} size="1.25rem" weight="fill" />

        <div className="flex-1">
          <ToastRadix.Title className={`text-md ${textColor}`}>{title}</ToastRadix.Title>

          <ToastRadix.Description className={`mt-2 text-sm ${textColor}`}>
            {description}
          </ToastRadix.Description>
        </div>

        <ToastRadix.Action altText="Close button" className={`cursor-pointer ${textColor}`}>
          <XIcon />
        </ToastRadix.Action>
      </ToastRadix.Root>

      <ToastRadix.Viewport className="fixed bottom-6 left-1/2 z-3 -translate-x-1/2 md:right-12 md:bottom-12 md:left-auto md:translate-x-0 md:transform-none" />
    </ToastRadix.Provider>
  );
}
