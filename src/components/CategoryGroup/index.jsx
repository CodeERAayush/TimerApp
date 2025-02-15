import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Timer from '../Timer';
import { darkTheme } from '../../theme';

const CategoryGroup = ({ 
  category, 
  timers, 
  onTimerComplete, 
  onTimerStatusChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [allTimersRunning, setAllTimersRunning] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleAllTimers = () => {
    const newStatus = !allTimersRunning;
    setAllTimersRunning(newStatus);
  };

  const resetAllTimers = () => {
    setAllTimersRunning(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.titleContainer} 
          onPress={toggleExpand}
        >
          <Icon 
            name={isExpanded ? 'chevron-down' : 'chevron-right'} 
            size={24} 
            color={darkTheme.colors.onSurface} 
          />
          <Text style={styles.title}>{category}</Text>
          <Text style={styles.count}>({timers.length})</Text>
        </TouchableOpacity>
        
        <View style={styles.groupControls}>
          <TouchableOpacity 
            style={styles.groupButton} 
            onPress={toggleAllTimers}
          >
            <Icon 
              name={allTimersRunning ? 'pause' : 'play'} 
              size={20} 
              color={darkTheme.colors.onSurface} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.groupButton} 
            onPress={resetAllTimers}
          >
            <Icon 
              name="restart" 
              size={20} 
              color={darkTheme.colors.onSurface} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.timersList}>
          {timers.map((timer) => (
            <Timer 
              key={timer.id}
              {...timer}
              isRunning={allTimersRunning}
              onComplete={() => onTimerComplete(timer.id)}
              onStatusChange={(status) => onTimerStatusChange(timer.id, status)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    marginVertical: darkTheme.spacing.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: darkTheme.spacing.md,
    backgroundColor: darkTheme.colors.surface,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...darkTheme.typography.h2,
    color: darkTheme.colors.onSurface,
    marginLeft: darkTheme.spacing.sm,
  },
  count: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.disabled,
    marginLeft: darkTheme.spacing.sm,
  },
  groupControls: {
    flexDirection: 'row',
  },
  groupButton: {
    padding: darkTheme.spacing.sm,
    marginLeft: darkTheme.spacing.sm,
  },
  timersList: {
    padding: darkTheme.spacing.md,
  },
});

export default CategoryGroup;