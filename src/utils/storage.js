import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TIMERS: '@timers',
  HISTORY: '@history'
};

export const saveTimers = async (timers) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(timers));
    return true;
  } catch (error) {
    console.error('Error saving timers:', error);
    return false;
  }
};

export const getTimers = async () => {
  try {
    const timers = await AsyncStorage.getItem(STORAGE_KEYS.TIMERS);
    return timers ? JSON.parse(timers) : [];
  } catch (error) {
    console.error('Error getting timers:', error);
    return [];
  }
};

export const saveToHistory = async (completedTimer) => {
  try {
    const history = await getHistory();
    const updatedHistory = [
      {
        ...completedTimer,
        completedAt: new Date().toISOString()
      },
      ...history
    ];
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error saving to history:', error);
    return false;
  }
};

export const getHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const exportData = async () => {
  try {
    const timers = await getTimers();
    const history = await getHistory();
    return JSON.stringify({ timers, history }, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};