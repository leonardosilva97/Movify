import React from 'react';
import {Image, Dimensions} from 'react-native';
import {Box} from './Box';
import {useAppTheme} from '../hooks';
import {tmdbService} from '../api/tmdbService';

const {width} = Dimensions.get('window');
const logoSize = Math.min(width * 0.12, 60);

interface StreamingLogoProps {
  logoPath: string;
  providerName: string;
}

export function StreamingLogo({
  logoPath,
  providerName,
}: StreamingLogoProps) {
  const theme = useAppTheme();
  const logoUrl = tmdbService.getImageUrl(logoPath, 'w92');

  return (
    <Box
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.s8,
        overflow: 'hidden',
      }}
    >
      {logoUrl && (
        <Image
          source={{uri: logoUrl}}
          style={{
            width: logoSize,
            height: logoSize,
          }}
          resizeMode="contain"
          accessibilityLabel={`Logo do ${providerName}`}
        />
      )}
    </Box>
  );
};