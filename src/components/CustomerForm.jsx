import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { validateCustomer } from '../utils/validators';

const CustomerForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save' }) => {
  const [formData, setFormData] = useState({
    phone: '',
    ...initialData,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ... formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async () => {
    const validation = validateCustomer(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <CustomInput
        label="Customer Phone (Optional)"
        value={formData.phone}
        onChangeText={(value) => handleChange('phone', value)}
        placeholder="10 digit number"
        keyboardType="phone-pad"
        maxLength={10}
        error={errors.phone}
      />

      <View style={styles.buttons}>
        <CustomButton
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={styles.button}
        />
        <CustomButton
          title={submitLabel}
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default CustomerForm;