import { useEffect, useState } from 'react';

import { fetchQueue, postApplied } from '@/features/queue/api';
import { navigateActiveTab } from '@/features/navigation/tabs';
import type { Vacancy } from '@/shared/types';

export function useQueue() {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [items, setItems] = useState<Vacancy[]>([]);
  const [cursor, setCursor] = useState(0);
  const [page, setPage] = useState(1);
  const [isExhausted, setIsExhausted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentItem = items[cursor];

  useEffect(() => {
    if (currentItem) {
      navigateActiveTab(currentItem.url);
    }
  }, [currentItem]);

  async function loadKeyword(kw: string) {
    setIsLoading(true);
    setKeyword(kw);
    setItems([]);
    setCursor(0);
    setPage(1);
    setIsExhausted(false);

    try {
      const { data } = await fetchQueue(kw, 1);
      setItems(data);
      setIsExhausted(data.length === 0);
    } finally {
      setIsLoading(false);
    }
  }

  async function next() {
    const nextCursor = cursor + 1;

    if (nextCursor >= items.length && keyword && !isExhausted) {
      setIsLoading(true);

      try {
        const nextPage = page + 1;
        const { data } = await fetchQueue(keyword, nextPage);

        if (data.length === 0) {
          setIsExhausted(true);
          return;
        }

        setItems((prev) => [...prev, ...data]);
        setPage(nextPage);
        setCursor(nextCursor);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (nextCursor < items.length) {
      setCursor(nextCursor);
    }
  }

  function previous() {
    setCursor((c) => Math.max(0, c - 1));
  }

  async function skip() {
    await next();
  }

  async function applied() {
    if (currentItem) {
      try {
        await postApplied(currentItem);
      } catch (error: any) {
        if (error?.response?.status !== 409) {
          throw error;
        }
      }
    }

    await next();
  }

  return {
    keyword,
    currentItem,
    cursor,
    isExhausted,
    isLoading,
    canGoBack: cursor > 0,
    loadKeyword,
    previous,
    skip,
    applied,
  };
}
