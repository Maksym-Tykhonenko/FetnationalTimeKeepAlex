import React, { useCallback, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { useStore } from '../TimeKeeperStore/timeKeeperContext';
import { BlurView } from '@react-native-community/blur';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';

const TimeKeepEditProfileModal = ({ visible, onClose }) => {
  const {
    timeKeepInputName,
    setTimeKeepInputName,
    timeKeepInputMotto,
    setTimeKeepInputMotto,
    timeKeepInputImage,
    setTimeKeepInputImage,
    saveCreatedProfile,
  } = useStore();
  const [localName, setLocalName] = useState(timeKeepInputName);
  const [localMotto, setLocalMotto] = useState(timeKeepInputMotto);
  const [localImage, setLocalImage] = useState(timeKeepInputImage);

  useFocusEffect(
    useCallback(() => {
      Platform.OS === 'android' && visible && Orientation.lockToPortrait();

      return () => Orientation.unlockAllOrientations();
    }, [visible]),
  );

  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      maxHeight: 700,
      maxWidth: 700,
      quality: 0.8,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) return;
      const uri = response?.assets?.[0]?.uri;
      if (uri) setLocalImage(uri);
    });
  };

  const handleTimeKeepProfileSave = async () => {
    setTimeKeepInputName(localName);
    setTimeKeepInputMotto(localMotto);
    setTimeKeepInputImage(localImage);
    await saveCreatedProfile(localName, localImage);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent={Platform.OS === 'android'}
    >
      {Platform.OS === 'ios' && (
        <BlurView
          style={styles.timekeepmodalblur}
          blurType="dark"
          blurAmount={2}
        />
      )}
      <View style={styles.timekeepmodaloverl}>
        <View style={styles.timekeepmodalcont}>
          <Text style={styles.timekeepmodaltitle}>Change profile</Text>

          <TextInput
            placeholder="Your name"
            placeholderTextColor="#888"
            style={styles.timekeepmodalinpt}
            value={localName}
            maxLength={12}
            onChangeText={setLocalName}
          />

          <TextInput
            placeholder="Your motto"
            placeholderTextColor="#888"
            multiline
            numberOfLines={3}
            maxLength={25}
            style={styles.timekeepmodaltextinp}
            value={localMotto}
            onChangeText={setLocalMotto}
          />

          <View style={styles.imageContainer}>
            {localImage ? (
              <Image
                source={{ uri: localImage }}
                style={styles.timekeepprofimg}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={{ color: '#777' }}>Add photo</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.timekeeppickaddphoto}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/timekeeppicker.png')}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.timekeepbtnrow}>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 26 }}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <LinearGradient
                colors={['#002640', '#FFFFFF36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timekeepbtngradborder}
              >
                <View style={[styles.timekeepbtnborders, { width: 120 }]}>
                  <View
                    style={[
                      styles.timekeepbtnwrp,
                      { backgroundColor: '#1A1A1A' },
                    ]}
                  >
                    <Text style={styles.timekeepbtntext}>CANCEL</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 26 }}
              activeOpacity={0.7}
              onPress={handleTimeKeepProfileSave}
            >
              <LinearGradient
                colors={['#002640', '#FFFFFF36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timekeepbtngradborder}
              >
                <View style={[styles.timekeepbtnborders, { width: 120 }]}>
                  <View style={styles.timekeepbtnwrp}>
                    <Text style={styles.timekeepbtntext}>CHANGE</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  timekeepmodaloverl: {
    flex: 1,
    backgroundColor: '#00000096',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timekeeppickaddphoto: {
    position: 'absolute',
    backgroundColor: '#1A1A1A',
    width: 140,
    height: 33,
    borderRadius: 6,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  timekeepmodalcont: {
    width: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
  },
  timekeepmodaltitle: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 24,
    marginBottom: 20,
  },
  timekeepmodalinpt: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff',
    padding: 12,
    marginBottom: 12,
    fontFamily: 'RedHatDisplay-Regular',
  },
  timekeepmodaltextinp: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff',
    padding: 12,
    minHeight: 80,
    fontFamily: 'RedHatDisplay-Regular',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  imageContainer: {
    alignSelf: 'center',
  },
  timekeepprofimg: {
    width: 165,
    height: 165,
    borderRadius: 10,
  },
  timekeepbtnrow: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  timekeepbtntext: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
  },
  timekeepbtnwrp: {
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#135CAA',
  },
  timekeepbtngradborder: { borderRadius: 11 },
  timekeepbtnborders: {
    padding: Platform.OS === 'ios' ? 1 : 0,
    margin: Platform.OS === 'ios' ? 0 : 1,
  },
  timekeepmodalblur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default TimeKeepEditProfileModal;
