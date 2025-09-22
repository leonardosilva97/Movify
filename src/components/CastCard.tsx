import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {Box} from './Box';
import {Text} from './Text';
import {useAppTheme} from '../hooks';
import {CastMember} from '../models/movie.api';

interface CastCardProps {
  cast: CastMember;
  onPress?: (actorId: number) => void;
}

export function CastCard({cast, onPress}: CastCardProps) {
  const {colors, spacing} = useAppTheme();

  const imageUrl = cast.profile_path
    ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
    : null;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(cast.id)}
      activeOpacity={0.7}
      style={{marginRight: spacing.s12}}>
      <Box
        backgroundColor="surface"
        borderRadius="s8"
        padding="s8"
        width={120}
        alignItems="center"
        style={{
          shadowColor: colors.text,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Box
          marginBottom="s8"
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            overflow: 'hidden',
            backgroundColor: colors.border,
          }}>
          {imageUrl ? (
            <Image
              source={{uri: imageUrl}}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
          ) : (
            <Box
              flex={1}
              alignItems="center"
              justifyContent="center"
              backgroundColor="border">
              <Text color="textSecondary" fontSize="lg">
                👤
              </Text>
            </Box>
          )}
        </Box>

        <Text
          color="text"
          fontSize="sm"
          fontWeight="medium"
          textAlign="center"
          numberOfLines={2}
          style={{marginBottom: spacing.s4}}>
          {cast.name}
        </Text>

        <Text
          color="textSecondary"
          fontSize="xs"
          textAlign="center"
          numberOfLines={1}>
          {cast.character}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};