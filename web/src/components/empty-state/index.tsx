import type { ReactElement } from 'react';

type EmptyStateProps = {
  icon: ReactElement;
  description: string;
};

export function EmptyState({ icon, description }: EmptyStateProps) {
  return (
    <div className="mt-16 mb-12 flex flex-col items-center justify-center gap-6">
      {icon}

      <p className="text-center text-gray-500 text-xs uppercase">{description}</p>
    </div>
  );
}
