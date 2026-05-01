import { LinkForm } from './link-form';
import { LinksList } from './links-list';
import { Logo } from './logo';

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-200 px-6 py-16">
      <div className="flex w-full flex-col items-center gap-16 md:mt-25 md:w-[calc(100vw - 1.5rem)] md:max-w-490 md:items-start">
        <Logo />

        <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:items-start md:gap-10">
          <LinkForm />
          <LinksList />
        </div>
      </div>
    </main>
  );
}
