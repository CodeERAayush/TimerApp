import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share
} from 'react-native';
import Typography from '../../library/Typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { getHistory, exportData } from '../../utils/storage';

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const historyData = await getHistory();
    setHistory(historyData);
  };

  const handleExport = async () => {
    const data = await exportData();
    if (data) {
      try {
        await Share.share({
          message: data,
          title: 'Timer History Export'
        });
      } catch (error) {
        console.error('Error sharing data:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderHistoryItem = ({ item }) => (
    <View style={[styles.historyItem, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.itemHeader}>
        <Typography style={[styles.itemName, { color: theme.colors.onSurface }]}>
          {item.name}
        </Typography>
        <Typography style={[styles.itemCategory, { color: theme.colors.primary }]}>
          {item.category}
        </Typography>
      </View>
      
      <View style={styles.itemDetails}>
        <Typography style={[styles.itemTime, { color: theme.colors.onSurface }]}>
          Duration: {Math.floor(item.duration / 60)} minutes
        </Typography>
        <Typography style={[styles.itemDate, { color: theme.colors.disabled }]}>
          {formatDate(item.completedAt)}
        </Typography>
      </View>
    </View>
  );

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' }
  ];

  const filterHistory = (items) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return items.filter(item => {
      const itemDate = new Date(item.completedAt);
      switch (filter) {
        case 'today':
          return itemDate >= today;
        case 'week':
          return itemDate >= weekAgo;
        default:
          return true;
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography style={[styles.title, { color: theme.colors.onSurface }]}>
          History
        </Typography>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExport}
        >
          <Icon name="export" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <View style={[styles.filterContainer, { backgroundColor: theme.colors.surface }]}>
        {filterButtons.map(button => (
          <TouchableOpacity
            key={button.value}
            style={[
              styles.filterButton,
              filter === button.value && [
                styles.filterButtonActive,
                { backgroundColor: theme.colors.primary }
              ]
            ]}
            onPress={() => setFilter(button.value)}
          >
            <Typography
              style={[
                styles.filterButtonText,
                { color: theme.colors.onSurface },
                filter === button.value && { color: theme.colors.onPrimary }
              ]}
            >
              {button.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filterHistory(history)}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.completedAt}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="timer-off"
              size={48}
              color={theme.colors.disabled}
            />
            <Typography style={[styles.emptyText, { color: theme.colors.disabled }]}>
              No completed timers yet
            </Typography>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
  },
  exportButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
  historyItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTime: {
    fontSize: 14,
  },
  itemDate: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default HistoryScreen;