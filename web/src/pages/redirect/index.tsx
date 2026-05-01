import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import logoIcon from '@/assets/logo.svg';
import { env } from '@/env';
import { api } from '@/service/api';

export function RedirectPage() {
  const [originalUrl, setOriginalUrl] = useState('/');

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const resolveAndRedirect = async () => {
      const shortCode = pathname.slice(1);

      if (!shortCode) {
        navigate('/url/not-found');
        return;
      }

      try {
        await api.get(`/links/${shortCode}`);

        const redirectUrl = `${env.VITE_BACKEND_URL}/${shortCode}`;

        setOriginalUrl(redirectUrl);

        window.location.href = redirectUrl;
      } catch (error) {
        const err = error as AxiosError;

        if (err.response?.status === 400 || err.response?.status === 404) {
          navigate('/url/not-found');
          return;
        }

        navigate('/url/not-found');
      }
    };

    if (pathname && pathname !== '/') {
      resolveAndRedirect();
    }
  }, [pathname, navigate]);

  return (
    <main className="w-screen min-h-screen flex flex-row items-center justify-center p-6 bg-gray-200">
      <div className="max-w-290 w-full h-fit flex flex-col gap-12 items-center text-center bg-gray-100 rounded-lg px-10 py-24 md:px-24 md:py-32">
        <img src={logoIcon} alt="brev.ly" className="h-24" />

        <h1 className="text-xl text-gray-600">Redirecting...</h1>

        <div className="flex flex-col gap-2">
          <p className="text-md text-gray-500">You’ll be redirected automatically in a moment...</p>

          <p className="text-md text-gray-500">
            Not redirected?{' '}
            <a href={originalUrl} className="text-blue-base underline">
              Click here.
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
