import { CopyIcon, TrashIcon } from '@phosphor-icons/react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useState } from 'react';
import { Button } from '@/components/button';
import { IconButton } from '@/components/icon-button';
import { Toast } from '@/components/toast';
import { api } from '@/service/api';
import { queryClient } from '@/service/query-client';

type LinkProps = {
  isFirstLink?: boolean;
  isLoading?: boolean;
  info?: {
    id: string;
    originalLink: string;
    shortCode: string;
    accessCount: number;
  };
};

export function Link({ isFirstLink = false, isLoading = false, info }: LinkProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionError, setDeletionError] = useState(false);

  const { id, originalLink, shortCode, accessCount } = info ?? {};

  const handleCopyShortenedLink = (): void => {
    const link = `${window.location.origin}/${shortCode}`;

    navigator.clipboard.writeText(link);

    setLinkCopied(true);
  };

  const handleDeleteLink = async (): Promise<void> => {
    setIsDeleting(true);

    try {
      await api.delete(`/links/${id}`);

      queryClient.refetchQueries({ queryKey: ['list links'], exact: true });

      setOpenDeleteDialog(false);
    } catch {
      setDeletionError(true);
    }

    setIsDeleting(false);
  };

  return (
    <>
      <div
        className={`flex flex-row items-center gap-8 border-gray-200 pt-3 md:gap-10 md:pt-4 ${
          isFirstLink ? 'border-t-0' : 'border-t'
        }`}
      >
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          {isLoading ? (
            <div className="h-9 w-2/4 animate-pulse rounded bg-gray-300" />
          ) : (
            <a
              href={`/${shortCode}`}
              target="_blank"
              rel="noreferrer"
              className="truncate text-blue-base text-md"
            >
              brev.ly/{shortCode}
            </a>
          )}

          {isLoading ? (
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-300" />
          ) : (
            <p className="truncate text-gray-500 text-sm">{originalLink}</p>
          )}
        </div>

        {isLoading ? (
          <div className="h-8 w-27 animate-pulse rounded bg-gray-300" />
        ) : (
          <p className="whitespace-nowrap text-gray-500 text-sm">{accessCount ?? 0} accesses</p>
        )}

        <div className="flex flex-row items-center gap-2">
          {isLoading ? (
            <>
              <div className="h-16 w-16 animate-pulse rounded bg-gray-300" />
              <div className="h-16 w-16 animate-pulse rounded bg-gray-300" />
            </>
          ) : (
            <>
              <IconButton icon={CopyIcon} onClick={handleCopyShortenedLink} />

              <AlertDialog.Root open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialog.Overlay className="fixed inset-0 z-2 bg-gray-600/30" />

                <AlertDialog.Trigger asChild>
                  <IconButton icon={TrashIcon} />
                </AlertDialog.Trigger>

                <AlertDialog.Content className="fixed top-1/2 left-1/2 z-3 w-150 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-8 shadow-gray-400 shadow-lg">
                  <AlertDialog.Title className="mb-4 text-gray-600 text-lg">
                    Delete link
                  </AlertDialog.Title>

                  <AlertDialog.Description className="mb-12 text-gray-600 text-sm">
                    Do you really want to delete the link {shortCode}?
                  </AlertDialog.Description>

                  <div className="flex flex-row justify-end gap-4">
                    <AlertDialog.Cancel asChild>
                      <Button variant="secondary" className="px-10 py-4">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>

                    <Button
                      onClick={handleDeleteLink}
                      isLoading={isDeleting}
                      disabled={isDeleting}
                      className="w-fit rounded-sm px-10 py-4"
                    >
                      Delete
                    </Button>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </>
          )}
        </div>
      </div>

      <div className="fixed z-3">
        <Toast
          type="information"
          title="Link copied to clipboard"
          description={`The link ${shortCode} was copied to the clipboard`}
          duration={3000}
          open={linkCopied}
          onOpenChange={setLinkCopied}
        />

        <Toast
          type="error"
          title="Failed to delete"
          description="Please, try again later."
          open={deletionError}
          onOpenChange={setDeletionError}
        />
      </div>
    </>
  );
}
