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
import { darkTheme } from '../../theme';
import Typography from '../../library/Typography';

const DEFAULT_CATEGORIES = ['Workout', 'Study', 'Break', 'Meditation', 'Custom'];

const CreateTimerForm = ({ visible, onClose, onSubmit }) => {
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
      category: finalCategory || 'Uncategorized'
    });
    setName('');
    setDuration('');
    setCategory('');
    setCustomCategory('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Typography style={styles.title}>Create New Timer</Typography>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={darkTheme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.inputGroup}>
              <Typography style={styles.label}>Timer Name</Typography>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter timer name"
                placeholderTextColor={darkTheme.colors.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Typography style={styles.label}>Duration (minutes)</Typography>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="Enter duration in minutes"
                keyboardType="numeric"
                placeholderTextColor={darkTheme.colors.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Typography style={styles.label}>Category</Typography>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Typography style={styles.categoryText}>
                  {category || 'Select category'}
                </Typography>
                <Icon
                  name={showCategories ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={darkTheme.colors.onSurface}
                />
              </TouchableOpacity>

              {showCategories && (
                <View style={styles.categoriesList}>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.categoryOption}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategories(false);
                      }}
                    >
                      <Typography style={styles.categoryOptionText}>{cat}</Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {category === 'Custom' && (
                <TextInput
                  style={styles.input}
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  placeholder="Enter custom category"
                  placeholderTextColor={darkTheme.colors.disabled}
                />
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!name || !duration) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!name || !duration}
            >
              <Typography style={styles.submitButtonText}>Create Timer</Typography>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: darkTheme.colors.background,
    borderTopLeftRadius: darkTheme.borderRadius.lg,
    borderTopRightRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: darkTheme.spacing.lg,
  },
  title: {
    ...darkTheme.typography.h2,
    color: darkTheme.colors.onBackground,
  },
  closeButton: {
    padding: darkTheme.spacing.sm,
  },
  inputGroup: {
    marginBottom: darkTheme.spacing.lg,
  },
  label: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.onBackground,
    marginBottom: darkTheme.spacing.sm,
  },
  input: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    color: darkTheme.colors.onSurface,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  categoryText: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.onSurface,
  },
  categoriesList: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    marginTop: darkTheme.spacing.sm,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  categoryOption: {
    padding: darkTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  categoryOptionText: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.onSurface,
  },
  submitButton: {
    backgroundColor: darkTheme.colors.primary,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    alignItems: 'center',
    marginTop: darkTheme.spacing.md,
  },
  submitButtonDisabled: {
    backgroundColor: darkTheme.colors.disabled,
  },
  submitButtonText: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.onPrimary,
    fontWeight: 'bold',
  },
});

export default CreateTimerForm;