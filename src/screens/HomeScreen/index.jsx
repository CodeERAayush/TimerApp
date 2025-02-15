import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import Typography from '../../library/Typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryGroup from '../../components/CategoryGroup';
import CreateTimerForm from '../../components/CreateTimerForm';
import { darkTheme } from '../../theme';
import { getTimers, saveTimers, saveToHistory } from '../../utils/storage';

const HomeScreen = ({ navigation }) => {
  const [timers, setTimers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadTimers();
  }, []);

  const loadTimers = async () => {
    const savedTimers = await getTimers();
    setTimers(savedTimers);
  };

  const handleCreateTimer = async (newTimer) => {
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    await saveTimers(updatedTimers);
  };

  const handleTimerComplete = async (timerId) => {
    const completedTimer = timers.find(timer => timer.id === timerId);
    await saveToHistory(completedTimer);
    
    Alert.alert(
      'Timer Completed! 🎉',
      `Congratulations! "${completedTimer.name}" has finished.`,
      [{ Typography: 'OK' }]
    );
  };

  const handleTimerStatusChange = (timerId, status) => {
    // You could add additional logic here if needed
    console.log(`Timer ${timerId} status changed to ${status}`);
  };

  // Group timers by category
  const groupedTimers = timers.reduce((groups, timer) => {
    const category = timer.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(timer);
    return groups;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.title}>My Timers</Typography>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('History')}
          >
            <Icon
              name="history"
              size={24}
              color={darkTheme.colors.onBackground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowCreateForm(true)}
          >
            <Icon
              name="plus"
              size={24}
              color={darkTheme.colors.onBackground}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(groupedTimers).map(([category, categoryTimers]) => (
          <CategoryGroup
            key={category}
            category={category}
            timers={categoryTimers}
            onTimerComplete={handleTimerComplete}
            onTimerStatusChange={handleTimerStatusChange}
          />
        ))}
      </ScrollView>

      <CreateTimerForm
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateTimer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: darkTheme.spacing.md,
    backgroundColor: darkTheme.colors.surface,
    elevation: 4,
  },
  title: {
    ...darkTheme.typography.h1,
    color: darkTheme.colors.onSurface,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: darkTheme.spacing.sm,
    marginLeft: darkTheme.spacing.md,
  },
  content: {
    flex: 1,
    padding: darkTheme.spacing.md,
  },
});

export default HomeScreen;