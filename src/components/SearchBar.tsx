import React from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {Box} from './Box';
import {Text} from './Text';
import {useAppTheme} from '../hooks';

export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  errorMessage?: string;
}

export function SearchBar({
  label,
  errorMessage,
  ...textInputProps
}: SearchBarProps) {
  const {colors, spacing, typography} = useAppTheme();

  return (
    <Box>
      {label && (
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="text"
          style={{marginBottom: spacing.s8}}
        >
          {label}
        </Text>
      )}
      
      <Box
        backgroundColor="surface"
        borderRadius="s12"
        paddingHorizontal="s16"
        paddingVertical="s12"
        style={{
          borderWidth: 1,
          borderColor: errorMessage ? colors.error : colors.border,
        }}
      >
        <TextInput
          style={{
            color: colors.text,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.regular,
            padding: 0,
            margin: 0,
          }}
          placeholderTextColor={colors.textSecondary}
          {...textInputProps}
        />
      </Box>
      
      {errorMessage && (
        <Text
          fontSize="xs"
          color="error"
          style={{marginTop: spacing.s4}}
        >
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}