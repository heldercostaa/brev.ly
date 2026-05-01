import { DownloadSimpleIcon, LinkBreakIcon, LinkIcon } from '@phosphor-icons/react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Spinner } from '@/components/spinner';
import { Toast } from '@/components/toast';
import { api } from '@/service/api';
import { downloadUrl } from '@/utils/download-url';
import { Link } from './link';

const PAGE_SIZE = 10;

type ShortenedLinkInfo = {
  id: string;
  originalLink: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
};

type ShortenedLinkList = {
  total: number;
  page: number;
  pageSize: number;
  data: ShortenedLinkInfo[];
};

type ExportOutput = {
  reportUrl: string;
};

export function LinksList() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  const {
    data: listOfLinks,
    isError: listOfLinksIsError,
    isFetching: listOfLinksIsFetching,
    isRefetching: listOfLinksIsRefetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ShortenedLinkList>({
    queryKey: ['list links'],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get(`/links?page=${pageParam}&pageSize=${PAGE_SIZE}`);

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.total > allPages.length * PAGE_SIZE) {
        return lastPage.page + 1;
      }

      return undefined;
    },
    refetchOnWindowFocus: true,
  });

  const onScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;

    const distanceFromScrollToEnd = scrollHeight - scrollTop - clientHeight;
    const scrollIsMiddle = distanceFromScrollToEnd <= clientHeight / 2;

    if (scrollIsMiddle && hasNextPage && !listOfLinksIsFetching) {
      fetchNextPage();
    }
  };

  const handleExportCSV = async (): Promise<void> => {
    setIsDownloading(true);

    try {
      const { data } = await api.post<ExportOutput>('/links/export');

      await downloadUrl(data.reportUrl);
    } catch {
      setDownloadError(true);
    }

    setIsDownloading(false);
  };

  const quantityOfLinks = listOfLinks?.pages[0]?.total ?? 0;
  const listOfLinksIsEmpty = quantityOfLinks === 0;

  return (
    <div className="relative flex h-fit w-full max-w-190 flex-1 flex-col gap-8 rounded-lg bg-gray-100 p-12 md:min-w-190 md:max-w-290 md:gap-10 md:p-16">
      {listOfLinksIsRefetching && (
        <div className="absolute top-0 left-0 h-1 w-full animate-border bg-size-[100px_auto] bg-linear-to-r from-blue-base to-blue-base bg-no-repeat md:bg-size-[200px_auto]" />
      )}

      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg text-gray-600">My links</h2>

        <Button
          variant="secondary"
          icon={DownloadSimpleIcon}
          onClick={handleExportCSV}
          isLoading={isDownloading}
          disabled={isDownloading}
        >
          Download CSV
        </Button>
      </div>

      <div className="border-t border-gray-200">
        {listOfLinksIsError ? (
          <EmptyState
            icon={<LinkBreakIcon size="2rem" color="var(--color-danger)" />}
            description="Error while loading links"
          />
        ) : !listOfLinks ? (
          <EmptyState icon={<Spinner />} description="Loading links..." />
        ) : listOfLinksIsEmpty ? (
          <EmptyState
            icon={<LinkIcon size="2rem" color="var(--color-gray-400)" />}
            description="No links found. Start by creating a new link."
          />
        ) : (
          <ScrollArea.Root type="auto" className="w-full">
            <ScrollArea.Viewport
              onScroll={onScroll}
              className="overflow-hidden"
              style={{
                maxHeight: 'calc(100vh - 21rem)',
                minHeight: quantityOfLinks < 4 ? 'fit-content' : '14.125rem',
              }}
            >
              <div className="flex flex-col gap-3 md:w-full md:gap-4">
                {listOfLinks.pages.map(({ page, data }) =>
                  data.map((link, index) => {
                    const isFirstLink = index === 0 && page === 1;

                    return <Link key={link.id} isFirstLink={isFirstLink} info={link} />;
                  })
                )}

                {hasNextPage && <Link isFirstLink={false} isLoading />}
              </div>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar
              orientation="vertical"
              className="-mr-7 flex w-4 rounded-full bg-gray-200 transition-colors duration-150 ease-out"
            >
              <ScrollArea.Thumb className="flex-1 rounded-full bg-blue-base hover:bg-blue-dark" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        )}
      </div>

      <Toast
        type="error"
        open={downloadError}
        onOpenChange={setDownloadError}
        title="Error while downloading"
        description="Please, try again later."
      />
    </div>
  );
}
