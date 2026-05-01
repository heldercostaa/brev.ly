import notFoundImage from '@/assets/404.svg';

export function NotFoundPage() {
  return (
    <main
      className="w-screen min-h-screen flex flex-row items-center justify-center p-6 bg-gray-200"
      data-testid="container-not-found"
    >
      <div className="max-w-290 w-full h-fit flex flex-col gap-12 items-center text-center bg-gray-100 rounded-lg px-10 py-24 md:px-24 md:py-32">
        <img
          src={notFoundImage}
          alt="Number 404 representing the error returned when accessing the page"
          className="h-36 md:h-42.5"
        />

        <h1 className="text-xl text-gray-600">Link not found</h1>

        <p className="text-md text-gray-500">
          The link you are trying to access does not exist, has been removed, or is an invalid URL.
          Learn more at{' '}
          <a href="/" className="text-blue-base underline" data-testid="link-brev-ly">
            brev.ly
          </a>
          .
        </p>
      </div>
    </main>
  );
}
