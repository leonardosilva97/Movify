export const colors = {
  // Cores principais
  background: '#0A0E27',
  surface: '#1A1F3A',
  primary: '#00D4FF',
  secondary: '#FF6B6B',
  
  // Cores de texto
  text: '#FFFFFF',
  textSecondary: '#B0B3B8',
  
  // Cores de interface
  border: '#2A2F4A',
  
  // Cores de status
  error: '#FF4757',
  success: '#2ED573',
  warning: '#FFA502',
  
  // Cores adicionais
  carrotSecondary: '#FF6B35',
} as const;

export type Colors = typeof colors;