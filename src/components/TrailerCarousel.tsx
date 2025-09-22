import React, {useRef, useEffect, useState} from 'react';
import {ScrollView, Animated, Dimensions, Image, Linking, Platform, Alert} from 'react-native';
import {Box} from './Box';
import {Text} from './Text';
import {TouchableOpacityBox} from './TouchableOpacityBox';
import {useAppTheme} from '../hooks/useAppTheme';
import {TrailerData} from '../hooks/usePopularTrailers';

interface TrailerCarouselProps {
  trailers: TrailerData[];
  title: string;
  isLoading?: boolean;
}

const {width: screenWidth} = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 32; // Largura total menos padding lateral
const CARD_HEIGHT = (screenWidth - 32) * 0.56; // Aspect ratio 16:9 para widescreen
const CARD_SPACING = 16;
const AUTO_SCROLL_INTERVAL = 5000; // 5 segundos

export function TrailerCarousel({
  trailers,
  title,
  isLoading = false,
}: TrailerCarouselProps) {
  const {colors, spacing} = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    if (!isLoading && trailers.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % trailers.length;
          
          // Scroll to next item
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              x: nextIndex * (CARD_WIDTH + CARD_SPACING),
              animated: true,
            });
          }
          
          return nextIndex;
        });
      }, AUTO_SCROLL_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [isLoading, trailers.length]);

  // Fade in animation
  useEffect(() => {
    if (!isLoading && trailers.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, trailers.length, fadeAnim]);

  const handleTrailerPress = async (youtubeKey: string) => {
    console.log('[TrailerCarousel] Iniciando abertura de trailer. youtubeKey=', youtubeKey);
    // Tenta várias abordagens em sequência; se uma falhar, tenta a próxima
    const candidates = Platform.OS === 'android'
      ? [`vnd.youtube:${youtubeKey}`, `intent://www.youtube.com/watch?v=${youtubeKey}#Intent;package=com.google.android.youtube;scheme=https;end`, `https://www.youtube.com/watch?v=${youtubeKey}`]
      : [`https://www.youtube.com/watch?v=${youtubeKey}`];

    let lastError: unknown = null;

    for (const url of candidates) {
      try {
        console.log('[TrailerCarousel] Tentando abrir URL:', url);
        await Linking.openURL(url);
        console.log('[TrailerCarousel] Sucesso ao abrir URL:', url);
        return; // sucesso
      } catch (err) {
        console.warn('[TrailerCarousel] Falhou ao abrir URL, tentando próximo:', url, err);
        lastError = err;
        // tenta o próximo
      }
    }

    console.error('[TrailerCarousel] Falha ao abrir trailer. Último erro:', lastError);
    Alert.alert('Erro', 'Não foi possível abrir o trailer no YouTube');
  };

  if (isLoading) {
    return (
      <Box marginTop="s24">
        <Text 
          color="text" 
          fontSize="xl" 
          fontWeight="bold"
          style={{marginBottom: spacing.s16, paddingHorizontal: spacing.s16}}
        >
          {title}
        </Text>
        <Box paddingHorizontal="s16">
          <Text color="textSecondary" fontSize="md">
            Carregando trailers...
          </Text>
        </Box>
      </Box>
    );
  }

  if (!trailers || trailers.length === 0) {
    return (
      <Box marginTop="s24">
        <Text 
          color="text" 
          fontSize="xl" 
          fontWeight="bold"
          style={{marginBottom: spacing.s16, paddingHorizontal: spacing.s16}}
        >
          {title}
        </Text>
        <Box paddingHorizontal="s16">
          <Text color="textSecondary" fontSize="md">
            Nenhum trailer encontrado
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box marginTop="s24">
      <Text 
        color="text" 
        fontSize="xl" 
        fontWeight="bold"
        style={{marginBottom: spacing.s16, paddingHorizontal: spacing.s16}}
      >
        {title}
      </Text>
      
      <Animated.View style={{opacity: fadeAnim}}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.s16,
            paddingVertical: spacing.s8,
          }}
          nestedScrollEnabled
          directionalLockEnabled
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          snapToAlignment="center"
          pagingEnabled={true}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
            setCurrentIndex(newIndex);
          }}
        >
          {trailers.map((trailer, index) => (
            <TouchableOpacityBox
              key={trailer.id}
              style={{
                width: CARD_WIDTH,
                marginRight: index === trailers.length - 1 ? 0 : CARD_SPACING,
                position: 'relative',
              }}
              onPress={() => handleTrailerPress(trailer.youtubeKey)}
              activeOpacity={0.8}
            >
              {/* Widescreen Video Container */}
              <Box
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: colors.surface,
                  position: 'relative',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Image
                  source={{
                    uri: trailer.backdropUrl || trailer.posterUrl || 'https://via.placeholder.com/300x450/333/fff?text=No+Image'
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
                
                {/* Play Icon Overlay - Maior para widescreen */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <Text 
                      style={{
                        fontSize: 28,
                        color: colors.primary,
                        marginLeft: 3, // Ajuste visual para centralizar o ícone
                      }}
                    >
                      ▶
                    </Text>
                  </Box>
                </Box>
                
                {/* Rating Badge */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text color="text" fontSize="sm" fontWeight="bold">
                    ⭐ {trailer.rating?.toFixed(1) || 'N/A'}
                  </Text>
                </Box>
              </Box>
              
              {/* Trailer Info - Redesenhado para widescreen */}
              <Box style={{marginTop: 12, paddingHorizontal: 4}}>
                <Text 
                  color="text" 
                  fontSize="lg" 
                  fontWeight="bold"
                  numberOfLines={1}
                  style={{lineHeight: 22}}
                >
                  {trailer.title}
                </Text>
                
                <Box style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                   <Text 
                     color="textSecondary" 
                     fontSize="sm"
                     numberOfLines={1}
                     style={{flex: 1}}
                   >
                     {trailer.trailerName}
                   </Text>
                 </Box>
              </Box>
            </TouchableOpacityBox>
          ))}
        </ScrollView>
      </Animated.View>
    </Box>
  );
};