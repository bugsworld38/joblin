import { useState } from 'react';

import { EmptyState } from '@/features/queue/EmptyState';
import { useQueue } from '@/features/queue/useQueue';
import { VacancyPanel } from '@/features/queue/VacancyPanel';

export function QueueView() {
  const {
    keyword,
    currentItem,
    isExhausted,
    isLoading,
    canGoBack,
    loadKeyword,
    previous,
    skip,
    applied,
  } = useQueue();
  const [keywordInput, setKeywordInput] = useState('');

  if (!keyword) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (keywordInput.trim()) {
            loadKeyword(keywordInput.trim());
          }
        }}
      >
        <input
          type="text"
          placeholder="Keyword (e.g. engineer)"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          required
        />
        <button type="submit">Start</button>
      </form>
    );
  }

  return (
    <div>
      {isExhausted && !currentItem && <EmptyState />}
      {currentItem && <VacancyPanel vacancy={currentItem} />}
      <div>
        <button onClick={previous} disabled={!canGoBack || isLoading}>
          Previous
        </button>
        <button onClick={skip} disabled={!currentItem || isLoading}>
          Skip
        </button>
        <button onClick={applied} disabled={!currentItem || isLoading}>
          Applied
        </button>
      </div>
    </div>
  );
}
