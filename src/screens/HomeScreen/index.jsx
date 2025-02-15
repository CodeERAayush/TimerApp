import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Typography from '../../library/Typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryGroup from '../../components/CategoryGroup';
import CreateTimerForm from '../../components/CreateTimerForm';
import {useTheme} from '../../theme/ThemeContext';
import {
  getTimers,
  saveTimers,
  saveToHistory,
  getHistory,
} from '../../utils/storage';

const HomeScreen = ({navigation}) => {
  const {theme, isDarkMode, toggleTheme} = useTheme();
  const [timers, setTimers] = useState([]);
  const [history, setHistory] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [activeTimers, setActiveTimers] = useState({});

  // Memoized data loading function
  const loadData = useCallback(async () => {
    try {
      const [savedTimers, savedHistory] = await Promise.all([
        getTimers(),
        getHistory(),
      ]);

      setTimers(savedTimers);
      setHistory(savedHistory);

      const uniqueCategories = [
        'all',
        ...new Set(savedTimers.map(timer => timer.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      Alert.alert('Error', 'Failed to load timer data');
      console.error('Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Cleanup function for active timers
    return () => {
      Object.values(activeTimers).forEach(({timeout, halfwayTimeout}) => {
        clearTimeout(timeout);
        clearTimeout(halfwayTimeout);
      });
    };
  }, [loadData]);

  // Timer management functions
  const handleCreateTimer = useCallback(async newTimer => {
    try {
      const updatedTimers = [...timers, newTimer];
      setTimers(updatedTimers);
      await saveTimers(updatedTimers);

      if (!categories.includes(newTimer.category)) {
        setCategories(prev => [...prev, newTimer.category]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create timer');
      console.error('Failed to create timer:', error);
    }
  }, [timers, categories]);

  const handleTimerComplete = useCallback(async timerId => {
    try {
      const completedTimer = timers.find(timer => timer.id === timerId);
      const updatedHistory = await saveToHistory(completedTimer);
      setHistory(updatedHistory);

      // Cleanup active timer
      if (activeTimers[timerId]) {
        const {timeout, halfwayTimeout} = activeTimers[timerId];
        clearTimeout(timeout);
        clearTimeout(halfwayTimeout);
        
        setActiveTimers(prev => {
          const {[timerId]: removed, ...rest} = prev;
          return rest;
        });
      }

      // Update timer state
      const updatedTimers = timers.map(timer =>
        timer.id === timerId ? {...timer, isRunning: false, progress: 0} : timer
      );
      setTimers(updatedTimers);
      await saveTimers(updatedTimers);

      Alert.alert('Timer Complete', `${completedTimer.name} has finished!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to complete timer');
      console.error('Failed to complete timer:', error);
    }
  }, [timers, activeTimers]);

  const handleTimerStatusChange = useCallback(async (timerId, isRunning) => {
    try {
      const timerToUpdate = timers.find(timer => timer.id === timerId);
      const duration = timerToUpdate.duration * 60 * 1000;

      if (isRunning) {
        const timeout = setTimeout(() => handleTimerComplete(timerId), duration);
        const halfwayTimeout = timerToUpdate.halfwayAlert
          ? setTimeout(() => {
              Alert.alert(
                'Halfway Point',
                `${timerToUpdate.name} is halfway complete!`
              );
            }, duration / 2)
          : null;

        setActiveTimers(prev => ({
          ...prev,
          [timerId]: {
            timeout,
            halfwayTimeout,
            startTime: Date.now(),
            duration,
          },
        }));

        Alert.alert('Timer Started', `${timerToUpdate.name} has started!`);
      } else {
        // Cleanup existing timer
        if (activeTimers[timerId]) {
          const {timeout, halfwayTimeout} = activeTimers[timerId];
          clearTimeout(timeout);
          clearTimeout(halfwayTimeout);
          
          setActiveTimers(prev => {
            const {[timerId]: removed, ...rest} = prev;
            return rest;
          });
        }
      }

      const updatedTimers = timers.map(timer =>
        timer.id === timerId
          ? {...timer, isRunning, progress: isRunning ? 0 : timer.progress}
          : timer
      );
      setTimers(updatedTimers);
      await saveTimers(updatedTimers);
    } catch (error) {
      Alert.alert('Error', 'Failed to update timer status');
      console.error('Failed to update timer status:', error);
    }
  }, [timers, activeTimers, handleTimerComplete]);

  // Memoized filters
  const filteredTimers = React.useMemo(() => 
    timers.filter(timer => 
      selectedCategory === 'all' || timer.category === selectedCategory
    ),
    [timers, selectedCategory]
  );

  const groupedTimers = React.useMemo(() => 
    filteredTimers.reduce((groups, timer) => {
      const category = timer.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(timer);
      return groups;
    }, {}),
    [filteredTimers]
  );

  // Render methods
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon
        name="timer-outline"
        size={64}
        color={theme.colors.disabled}
      />
      <Typography
        style={[styles.emptyStateText, {color: theme.colors.disabled}]}>
        {selectedCategory === 'all'
          ? "You haven't created any timers yet"
          : `No timers in the '${selectedCategory}' category`}
      </Typography>
      <TouchableOpacity
        style={[styles.emptyStateButton, {backgroundColor: theme.colors.primary}]}
        onPress={() => setShowCreateForm(true)}>
        <Typography
          style={[styles.emptyStateButtonText, {color: theme.colors.onPrimary}]}>
          Create Timer
        </Typography>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <Typography style={[styles.title, {color: theme.colors.onSurface}]}>
          My Timers
        </Typography>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
            <Icon
              name={isDarkMode ? 'weather-sunny' : 'weather-night'}
              size={24}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('History')}>
            <Icon name="history" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowCreateForm(true)}>
            <Icon name="plus" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        theme={theme}
      />

      <ScrollView style={styles.content}>
        {Object.entries(groupedTimers).map(([category, categoryTimers]) => (
          <CategoryGroup
            key={category}
            category={category}
            timers={categoryTimers}
            onTimerComplete={handleTimerComplete}
            onTimerStatusChange={handleTimerStatusChange}
            theme={theme}
          />
        ))}

        {Object.keys(groupedTimers).length === 0 && renderEmptyState()}
        <View style={{marginBottom: 20}} />
      </ScrollView>

      <CreateTimerForm
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateTimer}
        theme={theme}
        existingCategories={categories.filter(cat => cat !== 'all')}
      />
    </View>
  );
};

// Extracted CategoryFilter component for better organization
const CategoryFilter = React.memo(({
  categories,
  selectedCategory,
  onSelectCategory,
  theme
}) => (
  <View style={{height: '10%'}}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterButton,
            selectedCategory === category && styles.filterButtonActive,
            {
              borderColor: theme.colors.primary,
              backgroundColor:
                selectedCategory === category
                  ? theme.colors.primary
                  : 'transparent',
            },
          ]}
          onPress={() => onSelectCategory(category)}>
          <Typography
            style={[
              styles.filterButtonText,
              selectedCategory === category && styles.filterButtonTextActive,
              {
                color:
                  selectedCategory === category
                    ? theme.colors.onPrimary
                    : theme.colors.onSurface,
              },
            ]}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Typography>
        </TouchableOpacity>
      ))}
      <View style={{marginRight: 15}} />
    </ScrollView>
  </View>
));
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 12,
  },
  categoryFilter: {
    padding: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsModal: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
});

export default HomeScreen;
