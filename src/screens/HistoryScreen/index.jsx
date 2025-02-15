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
import { darkTheme } from '../../theme';
import { getHistory, exportData } from '../../utils/storage';

const HistoryScreen = ({ navigation }) => {
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
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <Typography style={styles.itemName}>{item.name}</Typography>
        <Typography style={styles.itemCategory}>{item.category}</Typography>
      </View>
      
      <View style={styles.itemDetails}>
        <Typography style={styles.itemTime}>
          Duration: {Math.floor(item.duration / 60)} minutes
        </Typography>
        <Typography style={styles.itemDate}>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={darkTheme.colors.onSurface} />
        </TouchableOpacity>
        <Typography style={styles.title}>History</Typography>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExport}
        >
          <Icon name="export" size={24} color={darkTheme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {filterButtons.map(button => (
          <TouchableOpacity
            key={button.value}
            style={[
              styles.filterButton,
              filter === button.value && styles.filterButtonActive
            ]}
            onPress={() => setFilter(button.value)}
          >
            <Typography
              style={[
                styles.filterButtonTypography,
                filter === button.value && styles.filterButtonTypographyActive
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
              color={darkTheme.colors.disabled}
            />
            <Typography style={styles.emptyTypography}>No completed timers yet</Typography>
          </View>
        }
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
    alignItems: 'center',
    padding: darkTheme.spacing.md,
    backgroundColor: darkTheme.colors.surface,
  },
  title: {
    ...darkTheme.typography.h1,
    color: darkTheme.colors.onSurface,
    flex: 1,
    marginLeft: darkTheme.spacing.md,
  },
  exportButton: {
    padding: darkTheme.spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: darkTheme.spacing.md,
    backgroundColor: darkTheme.colors.surface,
  },
  filterButton: {
    paddingVertical: darkTheme.spacing.sm,
    paddingHorizontal: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.round,
    marginRight: darkTheme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: darkTheme.colors.primary,
  },
  filterButtonTypography: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.onSurface,
  },
  filterButtonTypographyActive: {
    color: darkTheme.colors.onPrimary,
  },
  list: {
    padding: darkTheme.spacing.md,
  },
  historyItem: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: darkTheme.spacing.sm,
  },
  itemName: {
    ...darkTheme.typography.h2,
    color: darkTheme.colors.onSurface,
  },
  itemCategory: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.primary,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTime: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.onSurface,
  },
  itemDate: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.disabled,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: darkTheme.spacing.xl,
  },
  emptyTypography: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.disabled,
    marginTop: darkTheme.spacing.md,
  },
});

export default HistoryScreen;