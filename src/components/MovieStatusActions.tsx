import React from 'react';
import {Box, Text, TouchableOpacityBox} from './index';
import {MovieStatus} from '../models/movie';
import {useAppTheme} from '../hooks';

interface MovieStatusActionsProps {
  currentStatus: MovieStatus;
  isFavorite: boolean;
  onStatusChange: (status: MovieStatus) => void;
  onFavoriteToggle: () => void;
  onSchedulePress: () => void;
}

export function MovieStatusActions({
  currentStatus,
  isFavorite,
  onStatusChange,
  onFavoriteToggle,
  onSchedulePress,
}: MovieStatusActionsProps) {
  const theme = useAppTheme();

  const getStatusButtonStyle = (status: MovieStatus) => {
    return {
      backgroundColor: currentStatus === status ? theme.colors.primary : theme.colors.surface,
      borderWidth: 1,
      borderColor: currentStatus === status ? theme.colors.primary : theme.colors.border,
    };
  };

  const getStatusButtonTextColor = (status: MovieStatus) => {
    return currentStatus === status ? 'background' : 'text';
  };

  return (
    <Box marginBottom="s16">
      <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: theme.spacing.s8}}>
        Status
      </Text>
      
      <Box flexDirection="row" flexWrap="wrap" marginBottom="s12" style={{gap: theme.spacing.s8}}>
        <TouchableOpacityBox
          paddingHorizontal="s12"
          paddingVertical="s8"
          borderRadius="s8"
          style={getStatusButtonStyle('want_to_watch')}
          onPress={() => onStatusChange('want_to_watch')}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={getStatusButtonTextColor('want_to_watch')}
          >
            📋 Quero Assistir
          </Text>
        </TouchableOpacityBox>

        <TouchableOpacityBox
          paddingHorizontal="s12"
          paddingVertical="s8"
          borderRadius="s8"
          style={getStatusButtonStyle('watched')}
          onPress={() => onStatusChange('watched')}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={getStatusButtonTextColor('watched')}
          >
            ✅ Assistido
          </Text>
        </TouchableOpacityBox>
      </Box>

      <Box flexDirection="row" style={{gap: theme.spacing.s8}}>
        <TouchableOpacityBox
          flex={1}
          paddingVertical="s12"
          borderRadius="s8"
          backgroundColor={isFavorite ? 'primary' : 'surface'}
          style={{
            borderWidth: 1,
            borderColor: isFavorite ? theme.colors.primary : theme.colors.border,
          }}
          onPress={onFavoriteToggle}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={isFavorite ? 'background' : 'text'}
            textAlign="center"
          >
            {isFavorite ? '❤️ Favorito' : '🤍 Adicionar aos Favoritos'}
          </Text>
        </TouchableOpacityBox>

        <TouchableOpacityBox
          flex={1}
          paddingVertical="s12"
          borderRadius="s8"
          backgroundColor="surface"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
          onPress={onSchedulePress}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text"
            textAlign="center"
          >
            📅 Agendar
          </Text>
        </TouchableOpacityBox>
      </Box>
    </Box>
  );
};