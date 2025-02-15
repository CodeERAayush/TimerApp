import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Typography from '../../library/Typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { darkTheme } from '../../theme';

const Timer = ({ 
  name, 
  duration, 
  onComplete, 
  isRunning: parentIsRunning, 
  onStatusChange 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    setIsRunning(parentIsRunning);
  }, [parentIsRunning]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            onComplete();
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: 1 - (timeLeft / duration),
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [timeLeft, duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    const newStatus = !isRunning;
    setIsRunning(newStatus);
    onStatusChange(newStatus);
  };

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    onStatusChange(false);
  };

  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.name}>{name}</Typography>
        <Typography style={styles.time}>{formatTime(timeLeft)}</Typography>
      </View>
      
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { width: progressWidth, backgroundColor: darkTheme.colors.primary }
          ]} 
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleTimer} style={styles.button}>
          <Icon 
            name={isRunning ? 'pause' : 'play'} 
            size={24} 
            color={darkTheme.colors.onSurface} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={resetTimer} style={styles.button}>
          <Icon 
            name="restart" 
            size={24} 
            color={darkTheme.colors.onSurface} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    marginVertical: darkTheme.spacing.sm,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: darkTheme.spacing.sm,
  },
  name: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.onSurface,
  },
  time: {
    ...darkTheme.typography.h2,
    color: darkTheme.colors.onSurface,
  },
  progressContainer: {
    height: 4,
    backgroundColor: darkTheme.colors.border,
    borderRadius: darkTheme.borderRadius.round,
    overflow: 'hidden',
    marginVertical: darkTheme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: darkTheme.borderRadius.round,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: darkTheme.spacing.sm,
  },
  button: {
    padding: darkTheme.spacing.sm,
    marginLeft: darkTheme.spacing.sm,
  },
});

export default Timer;