import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  async saveData(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  async getData(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  }

  async updateData(key, value) {
    return await this.saveData(key, value);
  }

  async deleteData(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error deleting data:', error);
      return false;
    }
  }

  async clearAll() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  async exportAllData() {
    try {
      const keys = await this.getAllKeys();
      const data = {};
      
      for (const key of keys) {
        const value = await this.getData(key);
        data[key] = value;
      }
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  async importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      for (const [key, value] of Object.entries(data)) {
        await this.saveData(key, value);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export default new StorageService();