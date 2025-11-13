import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';

export const StoreContext = createContext();

export const useStore = () => {
  return useContext(StoreContext);
};

export const TimeKeepContext = ({ children }) => {
  const [timeKeepInputName, setTimeKeepInputName] = useState('');
  const [timeKeepInputMotto, setTimeKeepInputMotto] = useState('');
  const [timeKeepInputImage, setTimeKeepInputImage] = useState(null);
  const [timeKeepWorkoutMemories, setTimeKeepWorkoutMemories] = useState([]);
  const [isOnNotification, setIsOnNotification] = useState(false);

  const loadTimeKeepUserProfile = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('time-keep-user-profile');
      if (jsonValue) {
        const profile = JSON.parse(jsonValue);

        console.log('profile', profile);
        if (profile.name) setTimeKeepInputName(profile.name);
        if (profile.image) setTimeKeepInputImage(profile.image);
        if (profile.motto) setTimeKeepInputMotto(profile.motto);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const saveCreatedProfile = async profile => {
    try {
      await AsyncStorage.setItem(
        'time-keep-user-profile',
        JSON.stringify(profile),
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  const timeKeepContextValue = {
    timeKeepInputName,
    setTimeKeepInputName,
    timeKeepInputMotto,
    setTimeKeepInputMotto,
    timeKeepInputImage,
    setTimeKeepInputImage,
    loadTimeKeepUserProfile,
    saveCreatedProfile,
    timeKeepWorkoutMemories,
    setTimeKeepWorkoutMemories,
    isOnNotification,
    setIsOnNotification,
  };

  return (
    <StoreContext.Provider value={timeKeepContextValue}>
      {children}
    </StoreContext.Provider>
  );
};
