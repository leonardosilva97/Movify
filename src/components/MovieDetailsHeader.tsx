import React from 'react';
import {Image, Dimensions} from 'react-native';
import {Box, TouchableOpacityBox} from './index';
import {Icon} from './icons';
import {useAppTheme} from '../hooks';

const {width} = Dimensions.get('window');

interface MovieDetailsHeaderProps {
  posterUrl?: string;
  onBack: () => void;
}

export function MovieDetailsHeader({
  posterUrl,
  onBack,
}: MovieDetailsHeaderProps) {
  const {colors} = useAppTheme();

  return (
    <Box>
      {/* Header with back button */}
      <Box
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="s16"
        paddingVertical="s12"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <TouchableOpacityBox
          backgroundColor="surface"
          padding="s8"
          borderRadius="s20"
          onPress={onBack}
          style={{opacity: 0.9}}
        >
          <Icon name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacityBox>
      </Box>

      {/* Movie Poster */}
      {posterUrl && (
        <Image
          source={{uri: posterUrl}}
          style={{
            width: width,
            height: width * 1.5,
            resizeMode: 'cover',
          }}
        />
      )}
    </Box>
  );
};