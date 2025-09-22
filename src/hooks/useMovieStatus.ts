import {useMutation, useQueryClient} from '@tanstack/react-query';
import {movieDatabase} from '../database/movieDatabase';
import {MovieStatus} from '../models/movie';
import {useToastStore} from '../store/useToastStore';
import {formatDateToBrazilian} from '../utils/dateUtils';

export const useMovieStatus = () => {
  const queryClient = useQueryClient();
  const {showToast} = useToastStore();

  const updateMovieStatus = useMutation({
    mutationFn: async ({
      movieId,
      status,
      scheduledDate,
      isFavorite,
    }: {movieId: number; status?: MovieStatus; scheduledDate?: Date; isFavorite?: boolean}) => {
      // Se status for 'none' e não houver agendamento, removemos o registro
      if (status === 'none' && !scheduledDate && isFavorite === undefined) {
        await movieDatabase.removeMovieStatus(movieId);
      } else {
        await movieDatabase.updateMovieStatus({movieId, status, scheduledDate, isFavorite});
      }
      return {movieId, status, scheduledDate, isFavorite};
    },
    onSuccess: (data) => {
      // Invalidate all movie queries to refresh the UI
      queryClient.invalidateQueries({queryKey: ['movies']});
      // Ensure movie details screens refresh too
      queryClient.invalidateQueries({queryKey: ['movie', 'details', data.movieId]});
      queryClient.invalidateQueries({queryKey: ['movie', 'details-with-extras', data.movieId]});
      queryClient.invalidateQueries({queryKey: ['favorites']});
      
      // Show toast feedback
      const {status, scheduledDate, isFavorite} = data;
      if (scheduledDate) {
        try {
          const formatted = formatDateToBrazilian(scheduledDate);
          showToast(`📅 Agendamento salvo para ${formatted}`, 'success');
        } catch (_) {
          showToast('📅 Agendamento salvo', 'success');
        }
        return;
      }

      if (typeof isFavorite === 'boolean') {
        showToast(isFavorite ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos', 'info');
        return;
      }

      if (status === 'watched') {
        showToast('✓ Filme marcado como assistido!', 'success');
      } else if (status === 'want_to_watch') {
        showToast('⭐ Filme adicionado à lista de desejos!', 'info');
      } else if (status === 'none') {
        showToast('Filme removido das listas', 'info');
      }
    },
    onError: () => {
      showToast('Erro ao atualizar status do filme', 'error');
    },
  });

  const toggleWatched = (movieId: number, currentStatus: MovieStatus) => {
    const newStatus = currentStatus === 'watched' ? 'none' : 'watched';
    updateMovieStatus.mutate({movieId, status: newStatus});
  };

  const toggleFavorite = (movieId: number, currentIsFavorite: boolean) => {
    updateMovieStatus.mutate({movieId, isFavorite: !currentIsFavorite});
  };

  const toggleWantToWatch = (movieId: number, currentStatus: MovieStatus) => {
    const newStatus = currentStatus === 'want_to_watch' ? 'none' : 'want_to_watch';
    updateMovieStatus.mutate({movieId, status: newStatus});
  };

  // Salva/atualiza apenas a data de agendamento mantendo o status 'want_to_watch'
  const scheduleWatchDate = (
    movieId: number,
    _currentStatus: MovieStatus,
    date: Date,
  ) => {
    // Validar data futura (comparando apenas a data, sem horário)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      showToast('Selecione uma data futura para agendar.', 'error');
      return;
    }

    updateMovieStatus.mutate({movieId, status: 'want_to_watch', scheduledDate: selected});
  };

  return {
    updateMovieStatus,
    toggleWatched,
    toggleWantToWatch,
    toggleFavorite,
    scheduleWatchDate,
    isLoading: updateMovieStatus.isPending,
  };
};