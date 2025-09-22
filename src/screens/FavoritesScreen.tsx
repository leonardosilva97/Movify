import React, {useEffect, useState, useCallback} from 'react';
import {FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {Screen} from '../components/Screen';
import {Box} from '../components/Box';
import {Text} from '../components/Text';
import {MovieCard} from '../components/MovieCard';
import {useAppTheme} from '../hooks/useAppTheme';
import {useMovieStatus} from '../hooks/useMovieStatus';
import {Movie} from '../models/movie';
import {movieDatabase} from '../database/movieDatabase';
import {movieService} from '../services/movieService';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FavoritesStackParamList} from '../navigation/FavoritesStackNavigator';

export function FavoritesScreen() {
  const {colors, spacing} = useAppTheme();
  const navigation = useNavigation<StackNavigationProp<FavoritesStackParamList>>();
  const { toggleFavorite } = useMovieStatus();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [watchListMovies, setWatchListMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'watchlist'>('favorites');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const ITEMS_PER_PAGE = 10;

  const loadFavoriteMovies = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1 && !append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // Buscar filmes favoritos usando o novo método
      const favoriteStatuses = await movieDatabase.getFavoriteMovies();
      
      // Implementar paginação local
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedStatuses = favoriteStatuses.slice(startIndex, endIndex);
      
      // Para cada status, buscar os detalhes do filme
      const movies: Movie[] = [];
      for (const status of paginatedStatuses) {
        try {
          const movieDetails = await movieService.getMovieDetails(status.movie_id);
          // Adicionar informação de favorito e status
          movies.push({
            ...movieDetails,
            isFavorite: status.is_favorite,
            status: status.status,
          });
        } catch (error) {
          console.error(`Error loading movie ${status.movie_id}:`, error);
        }
      }
      
      if (append) {
        setFavoriteMovies(prev => [...prev, ...movies]);
      } else {
        setFavoriteMovies(movies);
      }

      // Verificar se há mais dados
      setHasMoreData(endIndex < favoriteStatuses.length);
      
    } catch (error) {
      console.error('Error loading favorite movies:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadWatchListMovies = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1 && !append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // Buscar filmes marcados para assistir
      const watchListStatuses = await movieDatabase.getMoviesByStatus('want_to_watch');
      
      // Implementar paginação local
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedStatuses = watchListStatuses.slice(startIndex, endIndex);
      
      // Para cada status, buscar os detalhes do filme
      const movies: Movie[] = [];
      for (const status of paginatedStatuses) {
        try {
          const movieDetails = await movieService.getMovieDetails(status.movie_id);
          // Adicionar informação de favorito e status
          movies.push({
            ...movieDetails,
            isFavorite: status.is_favorite,
            status: status.status,
            scheduledDate: status.scheduled_date ? new Date(status.scheduled_date) : undefined,
          });
        } catch (error) {
          console.error(`Error loading movie ${status.movie_id}:`, error);
        }
      }
      
      if (append) {
        setWatchListMovies(prev => [...prev, ...movies]);
      } else {
        setWatchListMovies(movies);
      }

      // Verificar se há mais dados
      setHasMoreData(endIndex < watchListStatuses.length);
      
    } catch (error) {
      console.error('Error loading watchlist movies:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMoreData(true);
    
    if (activeTab === 'favorites') {
      await loadFavoriteMovies(1, false);
    } else {
      await loadWatchListMovies(1, false);
    }
    
    setIsRefreshing(false);
  };

  const handleLoadMore = useCallback(async () => {
    if (!isLoadingMore && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      
      if (activeTab === 'favorites') {
        await loadFavoriteMovies(nextPage, true);
      } else {
        await loadWatchListMovies(nextPage, true);
      }
    }
  }, [currentPage, isLoadingMore, hasMoreData, activeTab]);

  const handleTabChange = (tabKey: string) => {
    const tab = tabKey as 'favorites' | 'watchlist';
    setActiveTab(tab);
    setCurrentPage(1);
    setHasMoreData(true);
    
    if (tab === 'favorites') {
      loadFavoriteMovies(1);
    } else {
      loadWatchListMovies(1);
    }
  };

  const handleFavoritePress = (movie: Movie) => {
    toggleFavorite(movie.id, movie.isFavorite || false);
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  useEffect(() => {
    loadFavoriteMovies();
  }, []);

  // Recarregar favoritos quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'favorites') {
        loadFavoriteMovies();
      } else {
        loadWatchListMovies();
      }
    }, [activeTab])
  );

  const currentMovies = activeTab === 'favorites' ? favoriteMovies : watchListMovies;
  const emptyMessage = activeTab === 'favorites' 
    ? 'Você ainda não tem filmes favoritos.\nExplore filmes e adicione aos seus favoritos!'
    : 'Você ainda não marcou filmes para assistir.\nExplore filmes e marque uma data para assistir!';

  const renderMovieItem = ({item, index}: {item: Movie; index: number}) => (
    <Box
      style={{
        marginLeft: index % 2 === 0 ? 0 : spacing.s8,
        marginRight: index % 2 === 0 ? spacing.s8 : 0,
      }}
    >
      <MovieCard
        movie={item}
        onPress={() => handleMoviePress(item)}
        onFavoritePress={() => handleFavoritePress(item)}
        hideStatusBadge={true}
      />
    </Box>
  );

  const renderEmptyState = () => (
    <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="s20">
      <Text fontSize="lg" fontWeight="bold" color="textSecondary" textAlign="center">
        {emptyMessage}
      </Text>
    </Box>
  );

  const renderLoadingFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <Box paddingVertical="s16" alignItems="center">
        <ActivityIndicator size="small" color={colors.primary} />
      </Box>
    );
  };

  const CategoryButton = ({
    category: _category,
    title,
    isActive,
    onPress,
  }: {
    category: 'favorites' | 'watchlist';
    title: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <Box
      backgroundColor={isActive ? 'primary' : 'surface'}
      paddingHorizontal="s16"
      paddingVertical="s8"
      borderRadius="s20"
      marginRight="s8"
      style={{
        borderWidth: 1,
        borderColor: isActive ? colors.primary : colors.border,
      }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        color={isActive ? 'background' : 'text'}
        onPress={onPress}
      >
        {title}
      </Text>
    </Box>
  );

  return (
    <Screen>
      <Box flex={1} backgroundColor="background">
        <Box paddingHorizontal="s20" paddingTop="s16" paddingBottom="s12">
          <Text fontSize="xl" fontWeight="bold" color="text" style={{marginBottom: spacing.s4}}>
            Meus Filmes
          </Text>
          <Text fontSize="md" color="textSecondary">
            {activeTab === 'favorites' 
              ? `${favoriteMovies.length} filme${favoriteMovies.length !== 1 ? 's' : ''} favorito${favoriteMovies.length !== 1 ? 's' : ''}`
              : `${watchListMovies.length} filme${watchListMovies.length !== 1 ? 's' : ''} para assistir`
            }
          </Text>
        </Box>

        <Box marginBottom="s16">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[
              {key: 'favorites', title: 'Favoritos'},
              {key: 'watchlist', title: 'Quero Assistir'},
            ]}
            renderItem={({item}) => (
              <CategoryButton
                category={item.key as 'favorites' | 'watchlist'}
                title={item.title}
                isActive={activeTab === item.key}
                onPress={() => handleTabChange(item.key)}
              />
            )}
            contentContainerStyle={{paddingHorizontal: spacing.s20}}
          />
        </Box>

        {isLoading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={colors.primary} />
          </Box>
        ) : (
          <FlatList
            data={currentMovies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingBottom: spacing.s20,
              paddingHorizontal: spacing.s16,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderLoadingFooter}
          />
        )}
      </Box>
    </Screen>
  );
}