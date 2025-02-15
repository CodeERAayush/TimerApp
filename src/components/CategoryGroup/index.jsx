import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Timer from '../Timer';
import { useTheme } from '../../theme/ThemeContext';

const CategoryGroup = ({
  category,
  timers,
  onTimerComplete,
  onTimerStatusChange
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [allTimersRunning, setAllTimersRunning] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleAllTimers = () => {
    const newStatus = !allTimersRunning;
    setAllTimersRunning(newStatus);
    // Update all timers in the group
    timers.forEach(timer => {
      onTimerStatusChange(timer.id, newStatus);
    });
  };

  const resetAllTimers = () => {
    setAllTimersRunning(false);
    // Reset all timers in the group
    timers.forEach(timer => {
      onTimerStatusChange(timer.id, false);
    });
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius?.md || 8
      }
    ]}>
      <View style={[
        styles.header,
        {
          backgroundColor: theme.colors.surface,
          padding: theme.spacing?.md || 16
        }
      ]}>
        <TouchableOpacity
          style={styles.titleContainer}
          onPress={toggleExpand}
        >
          <Icon
            name={isExpanded ? 'chevron-down' : 'chevron-right'}
            size={24}
            color={theme.colors.onSurface}
          />
          <Text style={[
            styles.title,
            {
              color: theme.colors.onSurface,
              marginLeft: theme.spacing?.sm || 8,
              ...theme.typography?.h2
            }
          ]}>
            {category}
          </Text>
          <Text style={[
            styles.count,
            {
              color: theme.colors.disabled,
              marginLeft: theme.spacing?.sm || 8,
              ...theme.typography?.body
            }
          ]}>
            ({timers.length})
          </Text>
        </TouchableOpacity>

        <View style={styles.groupControls}>
          <TouchableOpacity
            style={[
              styles.groupButton,
              {
                padding: theme.spacing?.sm || 8,
                marginLeft: theme.spacing?.sm || 8
              }
            ]}
            onPress={toggleAllTimers}
          >
            <Icon
              name={allTimersRunning ? 'pause' : 'play'}
              size={20}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.groupButton,
              {
                padding: theme.spacing?.sm || 8,
                marginLeft: theme.spacing?.sm || 8
              }
            ]}
            onPress={resetAllTimers}
          >
            <Icon
              name="restart"
              size={20}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isExpanded && (
        <View style={[
          styles.timersList,
          {
            padding: theme.spacing?.md || 16
          }
        ]}>
          {timers.map((timer) => (
            <Timer
              key={timer.id}
              {...timer}
              theme={theme}
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
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
  },
  count: {
    fontWeight: '400',
  },
  groupControls: {
    flexDirection: 'row',
  },
  groupButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timersList: {
    // padding: darkTheme.spacing.md,
  },
});

export default CategoryGroup;