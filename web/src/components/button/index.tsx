import type { IconProps } from '@phosphor-icons/react';
import type { ComponentProps, ElementType } from 'react';
import { tv } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'inline-flex cursor-pointer items-center justify-center gap-3 transition-all duration-300 disabled:cursor-not-allowed',
  variants: {
    variant: {
      primary:
        'w-full max-w-176 rounded-lg bg-blue-base px-10 py-7.5 text-md text-white disabled:opacity-50 hover:not-disabled:bg-blue-dark',
      secondary:
        'rounded-sm border border-gray-200 bg-gray-200 p-3.5 text-sm font-semibold text-gray-500 disabled:opacity-50 hover:not-disabled:border-blue-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type Props = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary';
  icon?: ElementType<IconProps>;
  isLoading?: boolean;
};

export function Button(props: Props) {
  const { variant, icon: Icon, isLoading, children, className, ...rest } = props;

  return (
    <button type="button" className={buttonVariants({ variant, className })} {...rest}>
      {isLoading ? (
        <span
          className={`h-6 w-6 animate-spin rounded-full border-2 border-t-white/40 ${
            variant === 'secondary' ? 'border-blue-base' : 'border-gray-100'
          }`}
        />
      ) : (
        <>
          {Icon && <Icon size="1rem" className="text-gray-600" />}
          {children}
        </>
      )}
    </button>
  );
}
