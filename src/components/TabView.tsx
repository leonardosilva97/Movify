import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Box, Text} from './index';
import {useAppTheme} from '../hooks/useAppTheme';

export interface Tab {
  key: string;
  title: string;
  count?: number;
}

interface TabViewProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  renderContent: (tab: Tab) => void;
}

export function TabView({
  tabs,
  activeTab,
  onTabPress,
  renderContent: _renderContent,
}: TabViewProps) {
  const {colors} = useAppTheme();

  return (
    <Box
      flexDirection="row"
      backgroundColor="surface"
      borderRadius="s12"
      padding="s4"
      marginBottom="s16"
      style={{
        shadowColor: colors.text,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={{flex: 1}}
          >
            <Box
              backgroundColor={isActive ? 'primary' : undefined}
              borderRadius="s8"
              paddingVertical="s12"
              paddingHorizontal="s16"
              alignItems="center"
              justifyContent="center"
            >
              <Box flexDirection="row" alignItems="center">
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? 'bold' : 'medium'}
                  color={isActive ? 'background' : 'text'}
                  textAlign="center"
                >
                  {tab.title}
                </Text>
                {tab.count !== undefined && (
                  <Box
                    backgroundColor={isActive ? 'background' : 'border'}
                    borderRadius="s8"
                    paddingHorizontal="s8"
                    paddingVertical="s4"
                    marginLeft="s8"
                    alignItems="center"
                    justifyContent="center"
                    style={{minWidth: 20}}
                  >
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color={isActive ? 'primary' : 'textSecondary'}
                    >
                      {tab.count}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};