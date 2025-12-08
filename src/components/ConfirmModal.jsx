import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CustomButton from './CustomButton';

const ConfirmModal = ({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[
          styles.modal, 
          { 
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
          }
        ]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>
          <View style={styles.buttons}>
            <CustomButton
              title={cancelText}
              onPress={onCancel}
              variant="outline"
              style={styles.button}
            />
            <CustomButton
              title={confirmText}
              onPress={onConfirm}
              variant={confirmVariant}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '88%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingHorizontal: 24,
    minWidth: 100,
  },
});

export default ConfirmModal;