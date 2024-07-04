// store.ts
import { create } from 'zustand'

interface SearchStore {
    searchQueryState: string;
    setSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    searchQueryState: localStorage.getItem('searchQuery') || '',
    setSearchQuery: (query: string) => {
        localStorage.setItem('searchQuery', query);
        set({ searchQueryState: query });
    },
}));
