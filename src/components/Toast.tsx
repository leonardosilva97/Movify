import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions} from 'react-native';
import {Box, Text} from './index';
import {useAppTheme} from '../hooks/useAppTheme';
import {Toast as ToastType} from '../store/useToastStore';

const {width} = Dimensions.get('window');

interface ToastProps {
  toast: ToastType;
  onHide: (id: string) => void;
}

export function Toast({toast, onHide}: ToastProps) {
  const {colors, spacing} = useAppTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after duration
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        hideToast();
      }, toast.duration - 300); // Start hiding 300ms before duration ends

      return () => clearTimeout(timer);
    }
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(toast.id);
    });
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
      default:
        return colors.primary;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{translateY: slideAnim}],
        opacity: opacityAnim,
        position: 'absolute',
        top: 60, // Below status bar
        left: spacing.s16,
        right: spacing.s16,
        zIndex: 9999,
      }}
    >
      <Box
        backgroundColor="surface"
        borderRadius="s12"
        paddingHorizontal="s16"
        paddingVertical="s12"
        flexDirection="row"
        alignItems="center"
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
          borderLeftWidth: 4,
          borderLeftColor: getBackgroundColor(),
        }}
      >
        <Box
          width={24}
          height={24}
          borderRadius="s12"
          backgroundColor={toast.type === 'success' ? 'success' : toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'primary'}
          alignItems="center"
          justifyContent="center"
          marginRight="s12"
        >
          <Text
            fontSize="sm"
            fontWeight="bold"
            style={{ color: '#FFFFFF' }}
          >
            {getIcon()}
          </Text>
        </Box>
        
        <Box flex={1}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text"
            numberOfLines={2}
          >
            {toast.message}
          </Text>
        </Box>
      </Box>
    </Animated.View>
  );
}