/**
 * Utilitários para formatação de datas
 */

/**
 * Formata uma data para o padrão brasileiro (DD/MM/AAAA)
 * @param date - Data como string, Date object ou timestamp
 * @returns String formatada no padrão DD/MM/AAAA
 */
export const formatDateToBrazilian = (date: string | Date | number): string => {
  try {
    const dateObj = new Date(date);
    
    // Verifica se a data é válida
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

/**
 * Formata uma data para o padrão brasileiro com nome do mês (DD de MMM de AAAA)
 * @param date - Data como string, Date object ou timestamp
 * @returns String formatada no padrão DD de MMM de AAAA
 */
export const formatDateToBrazilianWithMonth = (date: string | Date | number): string => {
  try {
    const dateObj = new Date(date);
    
    // Verifica se a data é válida
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

/**
 * Extrai apenas o ano de uma data
 * @param date - Data como string, Date object ou timestamp
 * @returns Ano como string
 */
export const getYearFromDate = (date: string | Date | number): string => {
  try {
    const dateObj = new Date(date);
    
    // Verifica se a data é válida
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }

    // Quando a string é 'YYYY-MM-DD', o JS interpreta como UTC 00:00,
    // o que pode "voltar" para o dia anterior em fusos negativos ao usar getFullYear().
    // Para manter o ano conforme a string, usamos o ano em UTC.
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return dateObj.getUTCFullYear().toString();
    }
    
    return dateObj.getFullYear().toString();
  } catch (error) {
    console.error('Erro ao extrair ano:', error);
    return 'N/A';
  }
};
