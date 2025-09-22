import React from 'react';
import {ScrollView} from 'react-native';
import {Box, Text, TouchableOpacityBox} from './index';
import {useAppTheme, useGenres} from '../hooks';
import {Genre} from '../models/movie.api';

export type MovieFilter = 'popular' | number; // popular ou ID do gênero

interface MovieCategoryTabsProps {
  activeFilter: MovieFilter;
  onFilterChange: (filter: MovieFilter) => void;
}

export function MovieCategoryTabs({
  activeFilter,
  onFilterChange,
}: MovieCategoryTabsProps) {
  const theme = useAppTheme();
  const {data: genres} = useGenres();

  // Gêneros principais que queremos mostrar
  const mainGenres = [
    {id: 28, name: 'Ação'},
    {id: 35, name: 'Comédia'},
    {id: 18, name: 'Drama'},
    {id: 27, name: 'Terror'},
    {id: 878, name: 'Ficção Científica'},
    {id: 53, name: 'Thriller'},
    {id: 10749, name: 'Romance'},
    {id: 16, name: 'Animação'},
  ];

  // Se os gêneros ainda não carregaram, usa os principais
  const displayGenres = genres || mainGenres;

  return (
    <Box marginBottom="s16">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: theme.spacing.s16}}
      >
        {/* Tab Popular */}
        <TouchableOpacityBox
          onPress={() => onFilterChange('popular')}
          paddingHorizontal="s16"
          paddingVertical="s8"
          marginRight="s8"
          borderRadius="s20"
          backgroundColor={activeFilter === 'popular' ? 'primary' : 'surface'}
        >
          <Text
            color={activeFilter === 'popular' ? 'background' : 'text'}
            fontSize="sm"
            fontWeight="medium"
          >
            Populares
          </Text>
        </TouchableOpacityBox>

        {/* Tabs de Gêneros */}
        {displayGenres.map((genre: Genre) => (
          <TouchableOpacityBox
            key={genre.id}
            onPress={() => onFilterChange(genre.id)}
            paddingHorizontal="s16"
            paddingVertical="s8"
            marginRight="s8"
            borderRadius="s20"
            backgroundColor={activeFilter === genre.id ? 'primary' : 'surface'}
          >
            <Text
              color={activeFilter === genre.id ? 'background' : 'text'}
              fontSize="sm"
              fontWeight="medium"
            >
              {genre.name}
            </Text>
          </TouchableOpacityBox>
        ))}
      </ScrollView>
    </Box>
  );
};