// store.ts
import { create } from 'zustand'

interface SearchStore {
    searchQueryState: string;
    setSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    searchQueryState: localStorage.getItem('searchQuery') || '',
    setSearchQuery: (query: string) => {
        if (localStorage === undefined) {
            return
        }
        localStorage.setItem('searchQuery', query);
        set({ searchQueryState: query });
    },
}));
