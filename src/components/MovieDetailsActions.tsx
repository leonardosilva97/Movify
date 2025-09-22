import React, {useState} from 'react';
import {Alert, TouchableWithoutFeedback, View, StyleSheet, Linking, Platform} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {Box, Text, TouchableOpacityBox} from './index';
import {Icon} from './icons';
import {useAppTheme} from '../hooks';
import {tmdbService} from '../api/tmdbService';
import {Movie, MovieStatus} from '../models/movie';
import RNCalendarEvents from 'react-native-calendar-events';
import {useToastStore} from '../store/useToastStore';

interface MovieDetailsActionsProps {
  movie: Movie;
  movieId: number;
  isUpdatingStatus: boolean;
  onStatusChange: (status: MovieStatus) => void;
  onScheduleDate: (dateString: string) => void;
  onToggleFavorite: () => void;
}

export function MovieDetailsActions({
  movie,
  movieId,
  isUpdatingStatus,
  onStatusChange,
  onScheduleDate,
  onToggleFavorite,
}: MovieDetailsActionsProps) {
  const {colors, spacing} = useAppTheme();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const {showToast} = useToastStore();
  const [shouldOpenConfirmation, setShouldOpenConfirmation] = useState(false);

  const getStatusButtonStyle = (status: MovieStatus) => {
    const isActive = movie?.status === status;
    
    if (status === 'watched' && isActive) {
      return {
        backgroundColor: '#22C55E', // Fundo verde para assistido
        borderColor: '#22C55E',
        borderWidth: 2,
      } as const;
    }
    
    // Para todos os demais casos (inclui want_to_watch ativo e inativo), manter estilo neutro
    return {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
    } as const;
  };

  const getStatusButtonTextColor = (_status: MovieStatus) => {
    // Sempre usar texto padrão (branco) para garantir contraste, exceto quando precisarmos de variação futuramente
    return 'text' as const;
  };

  const openScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedDate('');
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleDateConfirm = () => {
    if (!selectedDate) {
      Alert.alert('Atenção', 'Por favor, selecione uma data.');
      return;
    }
    // Sinaliza para abrir o modal de confirmação após o fechamento do bottom sheet
    setShouldOpenConfirmation(true);
    setIsScheduleModalOpen(false);

    // Salvar a data no app (aqui você pode implementar a lógica de salvamento)
    showToast('Data salva com sucesso!', 'success');
  };

  const handleAddToCalendar = async () => {
    try {
      if (!selectedDate) {
        Alert.alert('Atenção', 'Por favor, selecione uma data.');
        return;
      }

      // Solicitar permissões para acessar o calendário
      const authStatus = await RNCalendarEvents.requestPermissions();
      
      if (authStatus !== 'authorized') {
        Alert.alert(
          'Permissão necessária',
          'Para agendar no calendário, é necessário permitir o acesso ao calendário do dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configurações', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      // Seleciona um calendário editável (importante no Android)
      let calendarId: string | undefined = undefined;
      try {
        const calendars = await RNCalendarEvents.findCalendars();
        const writable = calendars.filter((c: any) => (c?.allowsModifications ?? true) || c?.isPrimary || c?.accessLevel === 'owner');
        const preferred = writable.find((c: any) => c?.isPrimary) 
          || writable.find((c: any) => String(c?.source || '').toLowerCase().includes('google'))
          || writable[0];
        calendarId = preferred?.id;
      } catch (e) {
        // Em caso de erro ao listar calendários, seguimos sem calendarId (o lib tentará usar o padrão)
        console.warn('Não foi possível obter os calendários:', e);
      }

      // Usar horário do meio-dia para evitar mudanças de dia devido ao fuso (especialmente quando convertido para UTC)
      const startLocal = new Date(selectedDate + 'T12:00:00');
      const endLocal = new Date(startLocal.getTime() + 2 * 60 * 60 * 1000); // +2 horas

      const eventConfig: any = {
        title: `Assistir: ${movie.title}`,
        notes: movie.overview || 'Filme agendado pelo Movify',
        startDate: startLocal.toISOString(),
        endDate: endLocal.toISOString(),
        allDay: false,
      };

      if (calendarId) {
        eventConfig.calendarId = calendarId;
      }

      const eventId = await RNCalendarEvents.saveEvent(eventConfig.title, eventConfig);
      
      if (eventId) {
        // Marcar como "quero assistir" no app
        onScheduleDate(selectedDate);
        onStatusChange('want_to_watch');
        
        Alert.alert(
          'Sucesso!',
          `Filme agendado para ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')} e adicionado ao seu calendário!`,
          [{ text: 'OK', onPress: () => setShowConfirmationModal(false) }]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível agendar o filme no calendário.');
      }
    } catch (error) {
      console.error('Erro ao agendar no calendário:', error);
      Alert.alert('Erro', 'Não foi possível agendar o filme no calendário.');
    }
  };

  const handleJustMarkAsWantToWatch = () => {
    // Apenas marcar como "quero assistir" sem agendar no calendário
    onScheduleDate(selectedDate);
    onStatusChange('want_to_watch');
    
    Alert.alert(
      'Sucesso!',
      `Filme marcado como "quero assistir" para ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}!`,
      [{ text: 'OK', onPress: () => setShowConfirmationModal(false) }]
    );
  };

  return (
    <Box paddingHorizontal="s16">
      {/* Status Buttons */}
      <Box style={{marginBottom: spacing.s20}}>
        <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s12}}>
          Status
        </Text>
        <Box flexDirection="row" style={{gap: 8}}>
          {/* Assistido */}
          <TouchableOpacityBox
            flex={1}
            paddingVertical="s12"
            paddingHorizontal="s12"
            borderRadius="s16"
            alignItems="center"
            style={getStatusButtonStyle('watched')}
            onPress={() => onStatusChange('watched')}
            disabled={isUpdatingStatus}
          >
            <Box flexDirection="row" alignItems="center" style={{gap: 8}}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={getStatusButtonTextColor('watched')}
              >
                ✓ Assistido
              </Text>
            </Box>
          </TouchableOpacityBox>

          {/* Quero assistir (abre modal de confirmação) */}
          <TouchableOpacityBox
            flex={1}
            paddingVertical="s12"
            paddingHorizontal="s12"
            borderRadius="s16"
            alignItems="center"
            style={getStatusButtonStyle('none')}
            onPress={openScheduleModal}
            disabled={isUpdatingStatus}
          >
            <Box flexDirection="row" alignItems="center" style={{gap: 8}}>
              <Icon name="calendar" size={16} color={colors.text} />
              <Text fontSize="sm" fontWeight="medium" color={getStatusButtonTextColor('none')}>
                {movie.scheduledDate ? 'Reagendar' : 'Quero assistir'}
              </Text>
            </Box>
          </TouchableOpacityBox>

          {/* Favoritar (independente do status) */}
          <TouchableOpacityBox
            flex={1}
            paddingVertical="s12"
            paddingHorizontal="s12"
            borderRadius="s16"
            alignItems="center"
            style={{
              backgroundColor: colors.surface,
              borderColor: movie?.isFavorite ? colors.primary : colors.border,
              borderWidth: movie?.isFavorite ? 2 : 1,
            }}
            onPress={onToggleFavorite}
            disabled={isUpdatingStatus}
          >
            <Box flexDirection="row" alignItems="center" style={{gap: 8}}>
              <Icon
                name="heart"
                size={16}
                color={colors.text}
                filled={Boolean(movie?.isFavorite)}
              />
              <Text fontSize="sm" fontWeight="medium" color={getStatusButtonTextColor('none')}>
                Favoritar
              </Text>
            </Box>
          </TouchableOpacityBox>
        </Box>
      </Box>

      {/* Bottom Sheet para seleção de data com calendário */}
      <Modal
        isVisible={isScheduleModalOpen}
        onBackdropPress={closeScheduleModal}
        onSwipeComplete={closeScheduleModal}
        swipeDirection={['down']}
        style={styles.bottomModal}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onModalHide={() => {
          if (shouldOpenConfirmation) {
            setShowConfirmationModal(true);
            setShouldOpenConfirmation(false);
          }
        }}
      >
        <Box
          backgroundColor="surface"
          style={{
            ...styles.bottomSheetContent,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingHorizontal: spacing.s20,
            paddingTop: spacing.s16,
            paddingBottom: spacing.s32,
          }}
        >
          {/* Handle do bottom sheet */}
          <Box
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              backgroundColor: colors.border,
              borderRadius: 2,
              marginBottom: spacing.s20,
            }}
          />

          <Text fontSize="lg" fontWeight="semiBold" color="text" style={{textAlign: 'center', marginBottom: spacing.s16}}>
            Escolha a data
          </Text>
          
          <Text fontSize="md" color="textSecondary" style={{textAlign: 'center', marginBottom: spacing.s20}}>
            Quando você quer assistir "{movie.title}"?
          </Text>

          {/* Calendário */}
          <Box style={{marginBottom: spacing.s20}}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.primary,
                  selectedTextColor: colors.background,
                },
              }}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                backgroundColor: colors.surface,
                calendarBackground: colors.surface,
                textSectionTitleColor: colors.text,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.background,
                todayTextColor: colors.primary,
                dayTextColor: colors.text,
                textDisabledColor: colors.textSecondary,
                dotColor: colors.primary,
                selectedDotColor: colors.background,
                arrowColor: colors.primary,
                disabledArrowColor: colors.textSecondary,
                monthTextColor: colors.text,
                indicatorColor: colors.primary,
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontWeight: '400',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13,
              }}
            />
          </Box>

          <Box style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.s16}}>
            <TouchableOpacityBox
              onPress={closeScheduleModal}
              style={{
                flex: 1,
                marginRight: spacing.s8,
                padding: spacing.s16,
                borderRadius: 8,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
              <Text fontSize="md" color="text" style={{textAlign: 'center'}}>
                Cancelar
              </Text>
            </TouchableOpacityBox>

            <TouchableOpacityBox
              onPress={handleDateConfirm}
              style={{
                flex: 1,
                marginLeft: spacing.s8,
                padding: spacing.s16,
                borderRadius: 8,
                backgroundColor: colors.primary,
              }}>
              <Text fontSize="md" color="background" style={{textAlign: 'center'}}>
                Confirmar Data
              </Text>
            </TouchableOpacityBox>
          </Box>
        </Box>
      </Modal>

      {/* Modal de confirmação para adicionar na agenda */}
      <Modal
        isVisible={showConfirmationModal}
        onBackdropPress={() => setShowConfirmationModal(false)}
        style={styles.centerModal}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <Box
          backgroundColor="surface"
          style={{
            padding: spacing.s20,
            borderRadius: 12,
            marginHorizontal: spacing.s20,
          }}
        >
          <Text fontSize="lg" fontWeight="semiBold" color="text" style={{textAlign: 'center', marginBottom: spacing.s16}}>
            Deseja adicionar na sua agenda?
          </Text>
          
          <Text fontSize="md" color="textSecondary" style={{textAlign: 'center', marginBottom: spacing.s20}}>
            Data selecionada: {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
          </Text>

          <Box style={{gap: 12}}>
            {/* Sim, adicionar na agenda */}
            <TouchableOpacityBox
              onPress={handleAddToCalendar}
              style={{
                padding: spacing.s16,
                borderRadius: 8,
                backgroundColor: colors.primary,
                alignItems: 'center',
              }}
            >
              <Box style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Icon name="calendar" size={18} color={colors.background} />
                <Text fontSize="md" fontWeight="medium" color="background">
                  Sim, adicionar na agenda
                </Text>
              </Box>
            </TouchableOpacityBox>

            {/* Não, apenas marcar como quero assistir */}
            <TouchableOpacityBox
              onPress={handleJustMarkAsWantToWatch}
              style={{
                padding: spacing.s16,
                borderRadius: 8,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
              }}
            >
              <Box style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Icon name="heart" size={18} color={colors.text} />
                <Text fontSize="md" fontWeight="medium" color="text">
                  Não, apenas marcar como "quero assistir"
                </Text>
              </Box>
            </TouchableOpacityBox>

            {/* Cancelar */}
            <TouchableOpacityBox
              onPress={() => setShowConfirmationModal(false)}
              style={{
                padding: spacing.s8,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text fontSize="sm" color="textSecondary">
                Cancelar
              </Text>
            </TouchableOpacityBox>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheetContent: {
    minHeight: 400,
  },
  centerModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});