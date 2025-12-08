import React, { createContext, useState, useEffect, useContext } from 'react';
import StorageService from '../storage/StorageService';
import { STORAGE_KEYS } from '../constants/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [pin, setPin] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isPinEnabled, setIsPinEnabled] = useState(false);

  useEffect(() => {
    loadPin();
  }, []);

  const loadPin = async () => {
    const savedPin = await StorageService.getData(STORAGE_KEYS.PIN);
    if (savedPin) {
      setPin(savedPin);
      setIsPinEnabled(true);
      setIsLocked(true);
    }
  };

  const setupPin = async (newPin) => {
    await StorageService.saveData(STORAGE_KEYS.PIN, newPin);
    setPin(newPin);
    setIsPinEnabled(true);
    setIsLocked(false);
  };

  const removePin = async () => {
    await StorageService.deleteData(STORAGE_KEYS.PIN);
    setPin(null);
    setIsPinEnabled(false);
    setIsLocked(false);
  };

  const verifyPin = (enteredPin) => {
    if (enteredPin === pin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (isPinEnabled) {
      setIsLocked(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        pin,
        isLocked,
        isPinEnabled,
        setupPin,
        removePin,
        verifyPin,
        lockApp,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);