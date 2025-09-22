import {useState, useCallback} from 'react';
import {useInfiniteSearchMovies} from './useMovies';

export const useMovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const searchMoviesQuery = useInfiniteSearchMovies(debouncedQuery);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Debounce the search query
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const isSearching = searchQuery.length > 0;
  const hasSearchResults = debouncedQuery.length > 0 && searchMoviesQuery.data;
  const searchResults = searchMoviesQuery.data?.pages.flatMap(page => page.movies) || [];

  return {
    searchQuery,
    debouncedQuery,
    isSearching,
    hasSearchResults,
    searchResults,
    searchMoviesQuery,
    handleSearchChange,
    clearSearch,
  };
};