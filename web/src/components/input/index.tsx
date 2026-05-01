import { WarningIcon } from '@phosphor-icons/react';
import { type ComponentProps, useEffect, useId, useMemo, useState } from 'react';
import { tv } from 'tailwind-variants';
import { getTextWidth } from '@/utils/get-text-width';

const labelVariants = tv({
  base: 'text-xs uppercase text-gray-500 peer-focus:font-bold',
  variants: {
    state: {
      normal: 'peer-focus:text-blue-base',
      invalid: 'peer-focus:text-danger',
    },
  },
  defaultVariants: {
    state: 'normal',
  },
});

const inputVariants = tv({
  base: 'peer z-1 w-full rounded-lg border py-7 text-md text-gray-600 caret-blue-base placeholder:text-gray-400',
  variants: {
    state: {
      normal: 'border-gray-300 focus:outline-blue-base',
      invalid: 'border-gray-300 focus:outline-danger',
    },
  },
  defaultVariants: {
    state: 'normal',
  },
});

type Props = Omit<ComponentProps<'input'>, 'id'> & {
  id?: string;
  label: string;
  fixedPlaceholder?: string;
  error?: string;
};

export function Input({ id: providedId, label, fixedPlaceholder, error, ...props }: Props) {
  const generatedId = useId();
  const [placeholderOffset, setPlaceholderOffset] = useState(0);

  const id = providedId ?? generatedId;
  const errorId = error ? `${id}-error` : undefined;
  const state = error ? 'invalid' : 'normal';

  useEffect(() => {
    let mounted = true;

    const calculate = async () => {
      if (!fixedPlaceholder) {
        if (mounted) setPlaceholderOffset(0);
        return;
      }

      await document.fonts.ready;

      const width = getTextWidth(fixedPlaceholder, '14px Open Sans');
      if (mounted) setPlaceholderOffset(width);
    };

    calculate();

    return () => {
      mounted = false;
    };
  }, [fixedPlaceholder]);

  const paddingLeft = useMemo(() => {
    if (!fixedPlaceholder) return '1rem';
    return `calc(${placeholderOffset / 16}rem + 1rem)`;
  }, [placeholderOffset, fixedPlaceholder]);

  return (
    <div className="relative flex w-full max-w-176 flex-col-reverse gap-4">
      {error ? (
        <div className="flex items-center gap-4">
          <WarningIcon size="1rem" color="var(--color-danger)" />
          <span id={errorId} className="text-sm text-gray-500">
            {error}
          </span>
        </div>
      ) : null}

      <input
        {...props}
        id={id}
        type="text"
        aria-describedby={errorId}
        className={inputVariants({ state })}
        style={{
          paddingLeft,
          paddingRight: '1rem',
        }}
      />

      {fixedPlaceholder && (
        <span className="pointer-events-none absolute top-18.5 left-8.5 z-1 text-md font-normal text-gray-400">
          {fixedPlaceholder}
        </span>
      )}

      <label htmlFor={id} className={labelVariants({ state })}>
        {label}
      </label>
    </div>
  );
}
