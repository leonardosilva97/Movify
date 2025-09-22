import React from 'react';
import {Image, Dimensions} from 'react-native';
import {Box, Text, TouchableOpacityBox} from './index';
import {useAppTheme} from '../hooks';
import {getYearFromDate} from '../utils/dateUtils';

const {width} = Dimensions.get('window');

interface MovieHeaderProps {
  posterUrl?: string;
  title: string;
  releaseDate?: string;
  onBack: () => void;
  onSearchPress: () => void;
}

export function MovieHeader({
  posterUrl,
  title,
  releaseDate,
  onBack,
  onSearchPress,
}: MovieHeaderProps) {
  const theme = useAppTheme();

  return (
    <>
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
          <Text fontSize="lg">←</Text>
        </TouchableOpacityBox>
      </Box>

      {/* Movie Poster */}
      <Box>
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
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        />
      </Box>

      {/* Movie Title and Year */}
      <Box padding="s16">
        <Text 
          fontSize="xxl" 
          fontWeight="bold" 
          style={{marginBottom: theme.spacing.s8}}
        >
          {title}
        </Text>
        
        {releaseDate && (
          <Text 
            fontSize="md" 
            color="textSecondary" 
            style={{marginBottom: theme.spacing.s16}}
          >
            {getYearFromDate(releaseDate)}
          </Text>
        )}
      </Box>
    </>
  );
};