import type { IconProps } from '@phosphor-icons/react';
import type { ComponentProps, ComponentType } from 'react';

type IconButtonProps = ComponentProps<'button'> & {
  icon: ComponentType<IconProps>;
};

export function IconButton({ icon: Icon, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className="cursor-pointer rounded-sm border border-gray-200 bg-gray-200 p-3.5 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:not-disabled:border-blue-base"
      {...props}
    >
      <Icon size="1rem" color="var(--color-gray-600)" />
    </button>
  );
}
