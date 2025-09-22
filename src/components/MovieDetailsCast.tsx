import React from 'react';
import {FlatList} from 'react-native';
import {Box, Text} from './index';
import {CastCard} from './CastCard';
import {useAppTheme} from '../hooks';
import {CastMember} from '../models/movie.api';

interface MovieDetailsCastProps {
  cast: CastMember[];
  onActorPress: (actorId: number) => void;
}

export function MovieDetailsCast({
  cast,
  onActorPress,
}: MovieDetailsCastProps) {
  const {spacing} = useAppTheme();

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <Box style={{marginBottom: spacing.s16}}>
      <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s8}}>
        Elenco
      </Text>
      <FlatList
        data={cast}
        renderItem={({item}) => (
          <CastCard cast={item} onPress={onActorPress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingRight: spacing.s16}}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}
        scrollEventThrottle={16}
      />
    </Box>
  );
};