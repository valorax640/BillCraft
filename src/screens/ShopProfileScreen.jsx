import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const ShopProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { shopProfile, updateShopProfile } = useData();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    gstNo: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shopProfile) {
      setFormData(shopProfile);
    }
  }, [shopProfile]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!formData.name. trim()) {
      Alert.alert('Error', 'Shop name is required');
      return;
    }

    setLoading(true);
    await updateShopProfile(formData);
    setLoading(false);
    Alert.alert('Success', 'Shop profile updated successfully');
    navigation. goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Shop Profile"
        onBack={() => navigation. goBack()}
      />

      <ScrollView style={styles.content}>
        <CustomInput
          label="Shop Name *"
          value={formData. name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Enter shop name"
        />

        <CustomInput
          label="Address"
          value={formData.address}
          onChangeText={(value) => handleChange('address', value)}
          placeholder="Enter shop address"
          multiline
          numberOfLines={3}
        />

        <CustomInput
          label="Phone Number"
          value={formData.phone}
          onChangeText={(value) => handleChange('phone', value)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <CustomInput
          label="GST Number"
          value={formData. gstNo}
          onChangeText={(value) => handleChange('gstNo', value)}
          placeholder="Enter GST number"
        />

        <CustomInput
          label="Email"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomButton
          title="Save Profile"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});

export default ShopProfileScreen;