import React, { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TokenContextType = {
  getToken: () => Promise<string | null>;
  saveToken: (token: string) => Promise<void>;
  deleteToken: () => Promise<void>;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

const TOKEN_KEY = 'user_token';

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error('useToken must be used within a TokenProvider');
  return context;
};

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to get token', e);
      return null;
    }
  };

  const saveToken = async (token: string) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to save token', e);
    }
  };

  const deleteToken = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to delete token', e);
    }
  };

  return (
    <TokenContext.Provider value={{ getToken, saveToken, deleteToken }}>
      {children}
    </TokenContext.Provider>
  );
};
