import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Toast } from '@/components/toast';
import { api } from '@/service/api';
import { queryClient } from '@/service/query-client';

const originalUrlErrorMessage = 'Inform a valid URL.';
const shortCodeErrorMessage = 'URL should be lowercased, no spaces and no special characters.';

type NewLinkData = z.infer<typeof newLinkSchema>;

type ErrorData = {
  message?: string;
  code?: string;
};

const newLinkSchema = z.object({
  originalUrl: z.url(originalUrlErrorMessage),
  shortCode: z.string().regex(/^[a-z0-9-]+$/, shortCodeErrorMessage),
});

export function LinkForm() {
  const [openToastError, setOpenToastError] = useState(false);
  const [errorCreatingNewLink, setErrorCreatingNewLink] = useState({
    title: '',
    description: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(newLinkSchema),
  });

  const handleSaveLink = async (data: NewLinkData): Promise<void> => {
    try {
      await api.post('/links', data);

      queryClient.refetchQueries({ queryKey: ['list links'], exact: true });

      reset();
    } catch (error) {
      const err = error as AxiosError;

      let description = 'Please, try again later.';

      const errorData = err.response?.data as ErrorData;

      if (err.status === 409 && errorData?.code === 'SHORT_CODE_EXISTS') {
        description = 'Short code already exists.';
      }

      setErrorCreatingNewLink({
        title: 'Creation error',
        description,
      });

      setOpenToastError(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSaveLink)}
        className="flex w-full max-w-190 flex-1 flex-col gap-10 rounded-lg bg-gray-100 p-12 md:min-w-145 md:gap-12 md:p-16"
      >
        <h2 className="text-lg text-gray-600">New Link</h2>

        <div className="flex flex-col gap-8">
          <Input
            label="Original URL"
            placeholder="https://example.com"
            error={errors.originalUrl?.message}
            {...register('originalUrl')}
          />
          <Input
            label="Short link"
            fixedPlaceholder="brev.ly/"
            error={errors.shortCode?.message}
            {...register('shortCode')}
          />
        </div>

        <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save link'}
        </Button>
      </form>

      <Toast
        type="error"
        title={errorCreatingNewLink.title}
        description={errorCreatingNewLink.description}
        open={openToastError}
        onOpenChange={setOpenToastError}
      />
    </>
  );
}
