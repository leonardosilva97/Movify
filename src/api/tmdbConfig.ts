import axios, {AxiosResponse} from 'axios';
import {TMDB_API_KEY} from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

// URLs para imagens do TMDB
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = {
  w92: 'w92',
  w154: 'w154',
  w185: 'w185',
  w342: 'w342',
  w500: 'w500',
  w780: 'w780',
  original: 'original',
};

export const BACKDROP_SIZES = {
  w300: 'w300',
  w780: 'w780',
  w1280: 'w1280',
  original: 'original',
};

// Função para construir URL de poster
export const buildPosterUrl = (posterPath: string | null, size: keyof typeof POSTER_SIZES = 'w500'): string => {
  if (!posterPath) {
    return 'https://via.placeholder.com/500x750/333/fff?text=No+Image';
  }
  return `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZES[size]}${posterPath}`;
};

// Função para construir URL de backdrop
export const buildBackdropUrl = (backdropPath: string | null, size: keyof typeof BACKDROP_SIZES = 'w1280'): string => {
  if (!backdropPath) {
    return 'https://via.placeholder.com/1280x720/333/fff?text=No+Image';
  }
  return `${TMDB_IMAGE_BASE_URL}/${BACKDROP_SIZES[size]}${backdropPath}`;
};

// Configuração do axios
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    language: 'pt-BR',
    api_key: TMDB_API_KEY,
  },
});

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    if (error.response) {
      // Erro de resposta do servidor
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.status_message || 'Unknown error'}`);
    } else if (error.request) {
      // Erro de rede
      throw new Error('Network error: Unable to connect to TMDB API');
    } else {
      // Outros erros
      throw new Error(`Request error: ${error.message}`);
    }
  },
);