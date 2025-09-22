import {Linking, Alert} from 'react-native';
import {useCallback} from 'react';

// URL schemes para deep linking dos principais streamings
const STREAMING_DEEP_LINKS: Record<string, string> = {
  '8': 'nflx://', // Netflix
  '119': 'aiv://', // Amazon Prime Video
  '337': 'disneyplus://', // Disney Plus
  '384': 'hbomax://', // HBO Max / Max
  '350': 'videos://', // Apple TV
  '531': 'paramountplus://', // Paramount Plus
  '15': 'hulu://', // Hulu
  '192': 'youtube://', // YouTube
  '283': 'crunchyroll://', // Crunchyroll
  '269': 'funimation://', // Funimation
};

// App Store URLs para instalação
const APP_STORE_URLS: Record<string, string> = {
  '8': 'https://apps.apple.com/app/netflix/id363590051',
  '119': 'https://apps.apple.com/app/amazon-prime-video/id545519333',
  '337': 'https://apps.apple.com/app/disney/id1446075923',
  '384': 'https://apps.apple.com/app/hbo-max/id971265422',
  '350': 'https://apps.apple.com/app/apple-tv/id1174078549',
  '531': 'https://apps.apple.com/app/paramount/id1259705244',
  '15': 'https://apps.apple.com/app/hulu/id376510438',
  '192': 'https://apps.apple.com/app/youtube/id544007664',
  '283': 'https://apps.apple.com/app/crunchyroll/id329913454',
  '269': 'https://apps.apple.com/app/funimation/id1065206416',
};

interface UseStreamingDeepLinkProps {
  providerId: number;
  providerName: string;
  movieTitle: string;
  tmdbWatchLink?: string;
}

export const useStreamingDeepLink = ({
  providerId,
  providerName,
  movieTitle,
  tmdbWatchLink,
}: UseStreamingDeepLinkProps) => {
  
  const inferSchemeByName = useCallback((name: string): string | null => {
    const n = name.toLowerCase();
    if (n.includes('prime') || n.includes('amazon')) return 'aiv://';
    if (n.includes('netflix')) return 'nflx://';
    if (n.includes('disney')) return 'disneyplus://';
    if (n.includes('hbo') || n === 'max' || n.includes('max')) return 'hbomax://';
    if (n.includes('apple')) return 'videos://';
    if (n.includes('paramount')) return 'paramountplus://';
    if (n.includes('hulu')) return 'hulu://';
    if (n.includes('youtube')) return 'youtube://';
    if (n.includes('crunchyroll')) return 'crunchyroll://';
    if (n.includes('funimation')) return 'funimation://';
    return null;
  }, []);

  const buildProviderSearchUrl = useCallback((name: string, title: string): string | null => {
    const q = encodeURIComponent(title);
    const n = name.toLowerCase();
    if (n.includes('prime') || n.includes('amazon')) return `https://www.primevideo.com/search?phrase=${q}`;
    if (n.includes('netflix')) return `https://www.netflix.com/search?q=${q}`;
    if (n.includes('disney')) return `https://www.disneyplus.com/search?q=${q}`;
    if (n.includes('hbo') || n.includes('max')) return `https://play.max.com/search?q=${q}`;
    if (n.includes('apple')) return `https://tv.apple.com/search?term=${q}`;
    if (n.includes('paramount')) return `https://www.paramountplus.com/search/?q=${q}`;
    if (n.includes('hulu')) return `https://www.hulu.com/search?q=${q}`;
    if (n.includes('youtube')) return `https://www.youtube.com/results?search_query=${q}`;
    if (n.includes('crunchyroll')) return `https://www.crunchyroll.com/search?q=${q}`;
    return tmdbWatchLink || null;
  }, [tmdbWatchLink]);

  const openStreamingApp = useCallback(async () => {
    // 1) Tentar abrir via esquema do app
    let deepLinkUrl: string | null = STREAMING_DEEP_LINKS[providerId.toString()] ?? null;
    if (!deepLinkUrl) {
      deepLinkUrl = inferSchemeByName(providerName);
    }

    if (deepLinkUrl) {
      try {
        const canOpen = await Linking.canOpenURL(deepLinkUrl);
        console.log(`Tentando abrir ${providerName} (${providerId}): ${deepLinkUrl}`);
        console.log(`canOpenURL result: ${canOpen}`);

        if (canOpen) {
          await Linking.openURL(deepLinkUrl);
          return true;
        }
      } catch (error) {
        console.error('Erro ao verificar deep link:', error);
      }
    }

    // 2) Fallback: abrir no navegador
    const webUrl = buildProviderSearchUrl(providerName, movieTitle);
    if (webUrl) {
      try {
        console.log(`Abrindo no navegador: ${webUrl}`);
        await Linking.openURL(webUrl);
        return true;
      } catch (error) {
        console.error('Erro ao abrir URL no navegador:', error);
      }
    }

    // 3) Fallback final: sugerir instalar o app
    Alert.alert(
      'App não encontrado',
      `O app ${providerName} não está instalado. Deseja instalá-lo?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Instalar',
          onPress: () => {
            const appStoreUrl = APP_STORE_URLS[providerId.toString()];
            if (appStoreUrl) {
              Linking.openURL(appStoreUrl);
            }
          },
        },
      ],
    );
    return false;
  }, [providerId, providerName, movieTitle, inferSchemeByName, buildProviderSearchUrl]);

  return {
    openStreamingApp,
  };
};