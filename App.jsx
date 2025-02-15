// App.js
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Navigation from './src/navigation';
import { darkTheme } from './src/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeProvider } from './src/theme/ThemeContext';
Icon.loadFont();

const App = () => {
  return (
    <ThemeProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={darkTheme.colors.background}
      />
      <Navigation />
    </ThemeProvider>
  );
};

export default App;