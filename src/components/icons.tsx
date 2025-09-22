import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Tipos para os ícones disponíveis
export type IconName = 'home' | 'heart' | 'calendar' | 'help-circle' | 'search' | 'play' | 'arrow-back';

// Interface para as props do componente Icon
export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
}

// Mapeamento dos ícones do Ionicons
const iconMap = {
  'home': 'home',
  'heart': 'heart',
  'calendar': 'calendar',
  'help-circle': 'help-circle',
  'search': 'search',
  'play': 'play',
  'arrow-back': 'arrow-back',
} as const;

// Componente Icon centralizado
export function Icon({ name, size = 24, color = '#000', filled = false }: IconProps) {
  const ioniconsName = iconMap[name];
  
  if (!ioniconsName) {
    console.warn(`Icon "${name}" not found`);
    return <Ionicons name="help-circle" size={size} color={color} />;
  }
  
  // Para ícones que têm versão outline/filled, usar a lógica apropriada
  let finalIconName: string = ioniconsName;
  if (name === 'heart' || name === 'home' || name === 'calendar') {
    finalIconName = filled ? ioniconsName : `${ioniconsName}-outline`;
  } else if (name === 'search') {
    finalIconName = 'search-outline';
  } else if (name === 'play') {
    finalIconName = filled ? 'play' : 'play-outline';
  } else if (name === 'arrow-back') {
    finalIconName = 'arrow-back-outline';
  }
  
  return <Ionicons name={finalIconName as any} size={size} color={color} />;
}