import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { queryClient } from '@/service/query-client';
import { refetchChannel } from '@/service/refetch-channel';
import { HomePage } from './pages/home';
import { NotFoundPage } from './pages/not-found';
import { RedirectPage } from './pages/redirect';

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/:shortCode',
    element: <RedirectPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes);

export function App() {
  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      queryClient.refetchQueries(event.data);
    };

    refetchChannel.onmessage = onMessage;

    return (): void => {
      refetchChannel.onmessage = null;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
