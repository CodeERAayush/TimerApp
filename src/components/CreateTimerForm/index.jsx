import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import Typography from '../../library/Typography';

const DEFAULT_CATEGORIES = ['Workout', 'Study', 'Break', 'Meditation', 'Custom'];

const CreateTimerForm = ({ visible, onClose, onSubmit, existingCategories = [] }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = () => {
    if (!name || !duration) return;

    const finalCategory = category === 'Custom' ? customCategory : category;
    onSubmit({
      id: Date.now().toString(),
      name,
      duration: parseInt(duration) * 60, // Convert minutes to seconds
      category: finalCategory || 'Uncategorized',
      halfwayAlert: false,
      isRunning: false,
      progress: 0
    });
    setName('');
    setDuration('');
    setCategory('');
    setCustomCategory('');
    onClose();
  };

  // Combine default and existing categories, removing duplicates
  const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...existingCategories])];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.formContainer, { 
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }]}>
          <View style={styles.header}>
            <Typography style={[styles.title, { color: theme.colors.onBackground }]}>
              Create New Timer
            </Typography>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.inputGroup}>
              <Typography style={[styles.label, { color: theme.colors.onBackground }]}>
                Timer Name
              </Typography>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface,
                  borderColor: theme.colors.border
                }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter timer name"
                placeholderTextColor={theme.colors.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Typography style={[styles.label, { color: theme.colors.onBackground }]}>
                Duration (minutes)
              </Typography>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface,
                  borderColor: theme.colors.border
                }]}
                value={duration}
                onChangeText={setDuration}
                placeholder="Enter duration in minutes"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Typography style={[styles.label, { color: theme.colors.onBackground }]}>
                Category
              </Typography>
              <TouchableOpacity
                style={[styles.categorySelector, {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }]}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Typography style={[styles.categoryText, { color: theme.colors.onSurface }]}>
                  {category || 'Select category'}
                </Typography>
                <Icon
                  name={showCategories ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>

              {showCategories && (
                <View style={[styles.categoriesList, {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }]}>
                  {allCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryOption, {
                        borderBottomColor: theme.colors.border
                      }]}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategories(false);
                      }}
                    >
                      <Typography style={[styles.categoryOptionText, { color: theme.colors.onSurface }]}>
                        {cat}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {category === 'Custom' && (
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.onSurface,
                    borderColor: theme.colors.border,
                    marginTop: 8
                  }]}
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  placeholder="Enter custom category"
                  placeholderTextColor={theme.colors.disabled}
                />
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.colors.primary },
                (!name || !duration) && { backgroundColor: theme.colors.disabled }
              ]}
              onPress={handleSubmit}
              disabled={!name || !duration}
            >
              <Typography style={[styles.submitButtonText, { color: theme.colors.onPrimary }]}>
                Create Timer
              </Typography>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  formContainer: {
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 16,
  },
  categoriesList: {
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
  },
  categoryOption: {
    padding: 12,
    borderBottomWidth: 1,
  },
  categoryOptionText: {
    fontSize: 16,
  },
  submitButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateTimerForm;