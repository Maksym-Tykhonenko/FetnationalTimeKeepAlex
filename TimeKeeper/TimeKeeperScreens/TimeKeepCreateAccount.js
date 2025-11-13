import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TimeKeepLayout from '../TimeKeeperComponents/TimeKeepLayout';
import { launchImageLibrary } from 'react-native-image-picker';
import { useStore } from '../TimeKeeperStore/timeKeeperContext';

const { height } = Dimensions.get('window');

const TimeKeepCreateAccount = () => {
  const [showTimeKeepImagePicker, setShowTimeKeepImagePicker] = useState(false);
  const [photoSelected, setPhotoSelected] = useState(false);
  const navigation = useNavigation();
  const {
    timeKeepInputName,
    setTimeKeepInputName,
    timeKeepInputMotto,
    setTimeKeepInputMotto,
    timeKeepInputImage,
    setTimeKeepInputImage,
    loadTimeKeepUserProfile,
    saveCreatedProfile,
  } = useStore();

  useEffect(() => {
    loadTimeKeepUserProfile();
  }, []);

  const timeKeepPhotoPicker = () => {
    const options = {
      mediaType: 'photo',
      maxHeight: 700,
      maxWidth: 700,
      quality: 0.8,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) return;
      const uri = response?.assets?.[0]?.uri;
      if (uri) {
        setTimeKeepInputImage(uri);

        const newProfile = {
          name: timeKeepInputName,
          motto: timeKeepInputMotto,
          image: uri,
        };

        await saveCreatedProfile(newProfile);
        setPhotoSelected(true);
      }
    });
  };

  const handleTimeKeepContinue = () => {
    if (!showTimeKeepImagePicker) {
      setShowTimeKeepImagePicker(true);
    } else if (photoSelected) {
      navigation.navigate('TimeKeeperTabs');
    }
  };

  const showContinueButton =
    (!showTimeKeepImagePicker &&
      timeKeepInputName.trim() &&
      timeKeepInputMotto.trim()) ||
    (showTimeKeepImagePicker && photoSelected);

  return (
    <TimeKeepLayout>
      <View style={styles.timekeepcn}>
        {Platform.OS === 'ios' ? (
          <Image
            source={require('../../assets/images/timekeeponb5.png')}
            style={styles.timekeeplogo}
          />
        ) : (
          <Image
            source={require('../../assets/images/andrlogo.png')}
            style={styles.timekeeplogo}
          />
        )}

        <View style={styles.timekeeepregcn}>
          <Text style={styles.timekeeptitle}>Registration</Text>

          {showTimeKeepImagePicker ? (
            <View>
              <Text style={styles.timekeepdescription}>Add photo</Text>
              <LinearGradient
                colors={['#0089C8', '#2B2B2B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.timekeepphotoGradient}
              >
                <View style={{ padding: 1 }}>
                  {timeKeepInputImage ? (
                    <>
                      {timeKeepInputImage ? (
                        <Image
                          source={{ uri: timeKeepInputImage }}
                          style={styles.timekeepphoto}
                        />
                      ) : (
                        <View style={styles.timekeepprofileplaceholder}>
                          <Text style={styles.timekeepprofileplaceholdertext}>
                            No photo
                          </Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.timekeepwelcomecn}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={timeKeepPhotoPicker}
                      >
                        <Image
                          source={require('../../assets/images/timekeeppicker.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {timeKeepInputImage && (
                    <TouchableOpacity
                      style={styles.timekeeppickaddphoto}
                      onPress={timeKeepPhotoPicker}
                      activeOpacity={0.5}
                    >
                      <Image
                        source={require('../../assets/images/timekeeppicker.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>
          ) : (
            <>
              <TextInput
                placeholder="Write your name"
                placeholderTextColor="#FFFFFF"
                maxLength={12}
                style={[
                  styles.timekeepinput,
                  timeKeepInputName && { fontSize: 14 },
                ]}
                value={timeKeepInputName}
                onChangeText={setTimeKeepInputName}
              />
              <TextInput
                placeholder="Write your motto"
                placeholderTextColor="#FFFFFF"
                maxLength={25}
                style={[
                  styles.timekeepmottoinput,
                  timeKeepInputMotto && { fontSize: 14 },
                ]}
                value={timeKeepInputMotto}
                onChangeText={setTimeKeepInputMotto}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </>
          )}

          {showContinueButton && (
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 26 }}
              activeOpacity={0.7}
              onPress={handleTimeKeepContinue}
            >
              <LinearGradient
                colors={['#002640', '#FFFFFF36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timekeepbtngradborder}
              >
                <View style={styles.timekeepbtnborders}>
                  <View style={styles.timekeepbtnwrp}>
                    <Text style={styles.timekeepbtntext}>Continue</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TimeKeepLayout>
  );
};

const styles = StyleSheet.create({
  timekeepcn: {
    paddingTop: height * 0.1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  timekeeplogo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 40,
    borderRadius: 32,
  },
  timekeeepregcn: {
    width: '100%',
    padding: 40,
    paddingHorizontal: 35,
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
  },
  timekeeptitle: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 22,
  },
  timekeepdescription: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 20,
  },
  timekeepinput: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#373737',
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#FFFFFF',
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    padding: 15,
  },
  timekeepmottoinput: {
    minHeight: 100,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#FFFFFF',
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#373737',
    padding: 15,
  },
  timekeepphotoGradient: {
    borderRadius: 10,
  },
  timekeepphoto: {
    width: '100%',
    height: 240,
    borderRadius: 10,
  },
  timekeepwelcomecn: {
    width: '100%',
    padding: 30,
    minHeight: 240,
    backgroundColor: '#2B2B2B',
    borderRadius: 10,
    borderBottomColor: '#2B2B2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timekeeppickaddphoto: {
    position: 'absolute',
    backgroundColor: '#1A1A1A',
    width: '90%',
    height: 33,
    borderRadius: 6,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  // button
  timekeepbtntext: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
  },
  timekeepbtnwrp: {
    height: 73,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#135CAA',
  },
  timekeepbtngradborder: { borderRadius: 10, width: 226 },
  timekeepbtnborders: {
    padding: Platform.OS === 'ios' ? 1 : 0,
    margin: Platform.OS === 'ios' ? 0 : 1,
  },
});

export default TimeKeepCreateAccount;
