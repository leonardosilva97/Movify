import React from 'react';
import {TextInput} from 'react-native';
import {Box, Text, TouchableOpacityBox} from './index';
import {useAppTheme} from '../hooks';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  isSearching: boolean;
  onSearchIconPress?: () => void;
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  onClearSearch,
  isSearching,
  onSearchIconPress,
}: SearchHeaderProps) {
  const theme = useAppTheme();

  return (
    <Box paddingHorizontal="s16" marginBottom="s16">
      <Box flexDirection="row" alignItems="center" marginBottom="s12">
        <Box flex={1}>
          <Text color="text" fontSize="xl" fontWeight="bold">
            {isSearching ? 'Resultados da Busca' : 'Descubra'}
          </Text>
        </Box>
      </Box>

      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="surface"
        borderRadius="s12"
        paddingHorizontal="s12"
        paddingVertical="s8"
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <TouchableOpacityBox onPress={onSearchIconPress} padding="s4">
          <Icon
            name="search"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacityBox>
        <TextInput
          placeholder="Buscar filmes..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          style={{
            flex: 1,
            color: theme.colors.text,
            fontSize: 16,
            paddingVertical: 0,
            marginLeft: theme.spacing.s8,
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacityBox onPress={onClearSearch} padding="s4" testID="clear-search-button">
            <Icon
              name="close-circle"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacityBox>
        )}
      </Box>
    </Box>
  );
};