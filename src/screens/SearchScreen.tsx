import React, {useEffect, useState, useMemo, useCallback, useRef} from 'react';
import {FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {useNavigation, useFocusEffect, CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {Screen, Box, MovieCard} from '../components';
import {SearchHeader} from '../components/SearchHeader';
import {MovieCategoryTabs, MovieFilter} from '../components/MovieCategoryTabs';
import {Movie, MovieStatus} from '../models/movie';
import {useAppTheme} from '../hooks';
import {useMovieSearch} from '../hooks/useMovieSearch';
import {movieDatabase} from '../database/movieDatabase';
import {useInfinitePopularMovies, useMoviesByGenre} from '../hooks';
import {useMovieStatus} from '../hooks/useMovieStatus';
import {HomeStackParamList} from '../navigation/HomeStackNavigator';
import {TabParamList} from '../navigation/TabNavigator';
import {tmdbService} from '../api/tmdbService';

type SearchScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<TabParamList>
>;

export function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const theme = useAppTheme();
  const flatListRef = useRef<FlatList>(null);
  
  // State
  const [activeFilter, setActiveFilter] = useState<MovieFilter>('popular');
  const [movieStatuses, setMovieStatuses] = useState<Record<number, {status: MovieStatus; isFavorite: boolean; scheduledDate?: Date}>>({});

  // Custom hooks
  const movieSearch = useMovieSearch();
  const {toggleFavorite} = useMovieStatus();

  // Queries
  const popularQuery = useInfinitePopularMovies();
  const genreQuery = useMoviesByGenre(
    typeof activeFilter === 'number' ? [activeFilter] : [],
    1
  );

  // Get current data based on active filter
  const currentMovies = useMemo(() => {
    if (movieSearch.hasSearchResults) {
      return movieSearch.searchResults;
    }
    
    if (activeFilter === 'popular') {
      return popularQuery.data?.pages.flatMap((page: any) => page.movies) || [];
    } else {
      // Transform genre API data to match Movie interface
      const genreMovies = genreQuery.data?.results || [];
      return genreMovies.map((movieAPI: any) => ({
        id: movieAPI.id,
        title: movieAPI.title,
        overview: movieAPI.overview,
        posterUrl: tmdbService.getImageUrl(movieAPI.poster_path),
        backdropUrl: tmdbService.getImageUrl(movieAPI.backdrop_path),
        releaseDate: movieAPI.release_date || '',
        rating: movieAPI.vote_average && !isNaN(movieAPI.vote_average) ? Math.round(movieAPI.vote_average * 10) / 10 : 0,
        voteCount: movieAPI.vote_count || 0,
        genres: [], // Will be populated if needed
        status: 'none' as const, // Default status
      }));
    }
  }, [activeFilter, popularQuery.data, genreQuery.data, movieSearch.hasSearchResults, movieSearch.searchResults]);

  // Initialize database and load movie statuses
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await movieDatabase.initDatabase();
        const statuses = await movieDatabase.getAllMovieStatuses();
        const statusMap: Record<number, {status: MovieStatus; isFavorite: boolean; scheduledDate?: Date}> = {};
        statuses.forEach(status => {
          statusMap[status.movie_id] = {
            status: status.status,
            isFavorite: Boolean(status.is_favorite),
            scheduledDate: status.scheduled_date ? new Date(status.scheduled_date) : undefined,
          };
        });
        setMovieStatuses(statusMap);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

  // Enrich movies with status
  const moviesWithStatus = useMemo(() => {
    return currentMovies.map((movie: any) => {
      const statusInfo = movieStatuses[movie.id];
      return {
        ...movie,
        status: statusInfo?.status || 'none',
        isFavorite: Boolean(statusInfo?.isFavorite),
        scheduledDate: statusInfo?.scheduledDate,
      };
    });
  }, [currentMovies, movieStatuses]);

  // Event handlers
  const handleMoviePress = useCallback((movie: Movie) => {
    navigation.navigate('MovieDetails', {movieId: movie.id});
  }, [navigation]);

  const handleFavoritePress = useCallback(async (movie: Movie) => {
    try {
      toggleFavorite(movie.id, Boolean(movie.isFavorite));
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  }, [toggleFavorite]);

  const scrollToTop = useCallback(() => {
    console.log('ScrollToTop called, flatListRef:', flatListRef.current);
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ 
        animated: true, 
        offset: 0 
      });
    }, 100);
  }, []);

  const handleRefresh = useCallback(() => {
    if (movieSearch.hasSearchResults) {
      movieSearch.searchMoviesQuery.refetch();
    } else if (activeFilter === 'popular') {
      popularQuery.refetch();
    } else {
      genreQuery.refetch();
    }
  }, [movieSearch.hasSearchResults, movieSearch.searchMoviesQuery, activeFilter, popularQuery, genreQuery]);

  const handleLoadMore = useCallback(() => {
    if (movieSearch.hasSearchResults) {
      if ('hasNextPage' in movieSearch.searchMoviesQuery && 
          movieSearch.searchMoviesQuery.hasNextPage && 
          !movieSearch.searchMoviesQuery.isFetchingNextPage) {
        movieSearch.searchMoviesQuery.fetchNextPage();
      }
    } else if (activeFilter === 'popular') {
      if ('hasNextPage' in popularQuery && 
          popularQuery.hasNextPage && 
          !popularQuery.isFetchingNextPage) {
        popularQuery.fetchNextPage();
      }
    }
    // Para gêneros, não implementamos paginação infinita ainda
  }, [movieSearch.hasSearchResults, movieSearch.searchMoviesQuery, activeFilter, popularQuery]);

  // Focus effect to reload data and scroll to top
  useFocusEffect(
    useCallback(() => {
      scrollToTop();
      
      const reloadStatuses = async () => {
        try {
          const statuses = await movieDatabase.getAllMovieStatuses();
          const statusMap: Record<number, {status: MovieStatus; isFavorite: boolean; scheduledDate?: Date}> = {};
          statuses.forEach(status => {
            statusMap[status.movie_id] = {
              status: status.status,
              isFavorite: Boolean(status.is_favorite),
              scheduledDate: status.scheduled_date ? new Date(status.scheduled_date) : undefined,
            };
          });
          setMovieStatuses(statusMap);
        } catch (error) {
          console.error('Error reloading movie statuses:', error);
        }
      };
      
      reloadStatuses();
    }, [scrollToTop])
  );

  // Render functions
  const renderMovieItem = ({item, index}: {item: Movie; index: number}) => (
    <Box
      style={{
        marginLeft: index % 2 === 0 ? 0 : theme.spacing.s8,
        marginRight: index % 2 === 0 ? theme.spacing.s8 : 0,
      }}
    >
      <MovieCard 
        movie={item} 
        onPress={handleMoviePress} 
        onFavoritePress={handleFavoritePress} 
      />
    </Box>
  );

  const renderFooter = () => {
    const isFetchingNext = movieSearch.hasSearchResults 
      ? ('isFetchingNextPage' in movieSearch.searchMoviesQuery && movieSearch.searchMoviesQuery.isFetchingNextPage)
      : (activeFilter === 'popular' && 'isFetchingNextPage' in popularQuery && popularQuery.isFetchingNextPage);
      
    if (isFetchingNext) {
      return (
        <Box paddingVertical="s16" alignItems="center">
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </Box>
      );
    }
    return null;
  };

  // Loading states
  const isLoading = (activeFilter === 'popular' ? popularQuery.isLoading : genreQuery.isLoading) || 
                   (movieSearch.hasSearchResults && movieSearch.searchMoviesQuery.isLoading);
  const isRefreshing = (activeFilter === 'popular' ? popularQuery.isRefetching : genreQuery.isRefetching) || 
                      (movieSearch.hasSearchResults && movieSearch.searchMoviesQuery.isRefetching);

  return (
    <Screen>
      <SearchHeader
        searchQuery={movieSearch.searchQuery}
        onSearchChange={movieSearch.handleSearchChange}
        onClearSearch={movieSearch.clearSearch}
        isSearching={movieSearch.isSearching}
        onSearchIconPress={scrollToTop}
      />

      {!movieSearch.isSearching && (
        <MovieCategoryTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      )}

      <Box flex={1} paddingHorizontal="s16">
        <FlatList
          ref={flatListRef}
          data={moviesWithStatus}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={Boolean(isRefreshing)}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{
            paddingBottom: theme.spacing.s20,
          }}
        />

        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            justifyContent="center"
            alignItems="center"
            backgroundColor="background"
            style={{opacity: 0.8}}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Box>
        )}
      </Box>
    </Screen>
  );
}