# Movify 🎬

App de descoberta e organização de filmes feito em React Native usando a API do The Movie Database (TMDB)

## 📱 Screenshots

<div align="center">
  <img src="./brend/Simulator Screenshot - iPhone 16 Pro - 2025-09-22 at 09.54.35.png" width="200" alt="Tela Home" style="margin: 10px;"/>
  <img src="./brend/Simulator Screenshot - iPhone 16 Pro - 2025-09-22 at 09.54.51.png" width="200" alt="Tela de Busca" style="margin: 10px;"/>
  <img src="./brend/Simulator Screenshot - iPhone 16 Pro - 2025-09-22 at 09.54.58.png" width="200" alt="Detalhes do Filme" style="margin: 10px;"/>
  
  <br/>
  
  <img src="./brend/Simulator Screenshot - iPhone 16 Pro - 2025-09-22 at 09.55.30.png" width="200" alt="Tela de Favoritos" style="margin: 10px;"/>
  <img src="./brend/Simulator Screenshot - iPhone 16 Pro - 2025-09-22 at 09.55.40.png" width="200" alt="Streaming Providers" style="margin: 10px;"/>
</div>

## 📋 Pré-requisitos

Será necessário o Node.js para executar o projeto em sua máquina

Consulte **`https://nodejs.org/en`** para saber sobre o Node

```
npm install
```

### 🔧 Instalação

Depois de clonar ou fazer download do projeto, no terminal integrado digite...

```
npm install
```

em seguida:

```
# Para iOS
npm run ios

# Para Android  
npm run android

# Ou inicie o Metro bundler
npm start
```

Através de um emulador ou do seu próprio smartphone você já pode visualizar o projeto

## 🛠️ Construído com

### ✨ Principais Funcionalidades

* 🎬 **Descoberta de Filmes** - Navegue por diferentes categorias (Populares, Em Cartaz, Mais Avaliados)
* 🔍 **Busca Inteligente** - Pesquise filmes por título com scroll infinito e debounce
* ❤️ **Sistema de Favoritos** - Adicione e remova filmes dos seus favoritos
* 📅 **Agendamento de Filmes** - Agende filmes para assistir com integração ao calendário nativo
* 🎭 **Lista "Quero Assistir"** - Organize filmes que pretende assistir
* 📺 **Provedores de Streaming** - Veja onde assistir cada filme (Netflix, Prime Video, etc.)
* 🎥 **Trailers** - Assista trailers dos filmes diretamente no app
* 👥 **Elenco e Equipe** - Informações detalhadas sobre atores e diretores
* 🔄 **Scroll Infinito** - Carregamento automático de mais conteúdo
* 📱 **Pull to Refresh** - Atualize as listas puxando para baixo
* 🌙 **Tema Escuro** - Interface moderna com design escuro
* 💾 **Persistência Local** - Dados salvos localmente com SQLite

### 🚀 Tecnologias Utilizadas

Para a construção desse projeto, utilizei um conjunto poderoso de tecnologias, incluindo:

* ⚛️ **React Native** - Framework principal para desenvolvimento mobile multiplataforma
* 📘 **TypeScript** - Tipagem estática para maior segurança e produtividade no desenvolvimento
* 🧭 **React Navigation** - Navegação fluida entre telas com Stack e Bottom Tab Navigation
* 🗄️ **SQLite** - Banco de dados local para persistir favoritos, status e agendamentos
* 🐻 **Zustand** - Gerenciamento de estado global leve e eficiente
* 🔄 **TanStack Query (React Query)** - Cache inteligente e sincronização de dados da API
* 🌐 **Axios** - Cliente HTTP para consumo da API REST do TMDB
* 📅 **React Native Calendar Events** - Integração com calendário nativo do dispositivo
* 🗓️ **React Native Calendars** - Componente de calendário customizável
* 📱 **React Native DateTimePicker** - Seletor de data e hora nativo
* 🎨 **React Native Linear Gradient** - Gradientes para interface mais atraente
* 🔔 **React Native Modal** - Modais nativos para melhor UX
* 🎭 **React Native Vector Icons** - Ícones vetoriais (Lucide React Native)
* 🏠 **AsyncStorage** - Armazenamento local assíncrono
* 🔒 **React Native Dotenv** - Gerenciamento seguro de variáveis de ambiente
* 🎯 **React Native Gesture Handler** - Gestos nativos otimizados
* 🛡️ **React Native Safe Area Context** - Gerenciamento de áreas seguras
* 📺 **React Native Screens** - Otimização de performance de navegação

### 🎯 Funcionalidades Avançadas

* 🔄 **Infinite Scroll** - Carregamento automático de mais filmes conforme o usuário navega
* 🔍 **Debounced Search** - Busca otimizada com delay para melhor performance
* 📱 **Deep Linking** - Abertura direta de apps de streaming quando disponível
* 🎬 **Trailer Integration** - Reprodução de trailers com carrossel horizontal
* 📊 **Status Management** - Sistema completo de status (Favorito, Assistido, Quero Assistir)
* 🗓️ **Calendar Integration** - Agendamento de filmes com lembretes no calendário nativo
* 🌍 **Streaming Providers** - Informações de onde assistir por região (Brasil)
* 👤 **Actor Details** - Telas dedicadas para informações de atores
* 🎨 **Custom Theme System** - Sistema de temas customizável com cores e espaçamentos
* 📱 **Responsive Design** - Layout adaptativo para diferentes tamanhos de tela
* ⚡ **Performance Optimized** - Memoização de componentes e lazy loading de imagens

## 🔧 Configuração da API

O aplicativo utiliza a API v3 do TMDB. Você precisará de:

1. Crie uma conta em **`https://www.themoviedb.org/`**
2. Obtenha sua API Key
3. Copie `.env.example` para `.env`
4. Adicione sua API Key no arquivo `.env`:

```env
TMDB_API_KEY=sua_api_key_aqui
```

## 📊 Arquitetura do Projeto

```
src/
├── api/           # Configuração da API do TMDB
├── components/    # Componentes reutilizáveis (MovieCard, StreamingCard, etc.)
├── database/      # Configuração do SQLite para persistência local
├── hooks/         # Hooks customizados (useMovies, useInfiniteScroll, etc.)
├── models/        # Tipos TypeScript e interfaces
├── navigation/    # Configuração de navegação (Stack, Tab)
├── screens/       # Telas do aplicativo (Home, Search, Favorites, MovieDetails)
├── services/      # Serviços de dados e API calls
├── store/         # Gerenciamento de estado com Zustand
├── theme/         # Sistema de temas (cores, tipografia, espaçamentos)
└── utils/         # Utilitários e helpers
```

## 🎨 Design System

O projeto implementa um design system completo com:

* **Cores**: Paleta de cores consistente para tema escuro
* **Tipografia**: Sistema de fontes com diferentes pesos e tamanhos
* **Espaçamentos**: Grid system para layouts consistentes
* **Componentes**: Biblioteca de componentes reutilizáveis (Box, Text, TouchableOpacityBox)
* **Ícones**: Integração com Lucide React Native para ícones consistentes

## 🚀 Performance

* **Lazy Loading**: Carregamento sob demanda de imagens e componentes
* **Memoização**: Componentes otimizados com React.memo e useMemo
* **Virtual Lists**: FlatList otimizada para grandes listas de filmes
* **Cache Inteligente**: TanStack Query para cache automático de dados da API
* **Debounced Search**: Redução de chamadas desnecessárias à API

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🙏 Agradecimentos

- [The Movie Database (TMDB)](https://www.themoviedb.org/) pelos dados dos filmes
- [React Native Community](https://reactnative.dev/) pela excelente documentação

