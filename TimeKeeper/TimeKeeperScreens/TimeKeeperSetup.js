import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TimeKeepLayout from '../TimeKeeperComponents/TimeKeepLayout';
import { useStore } from '../TimeKeeperStore/timeKeeperContext';
import TimeKeepEditProfileModal from '../TimeKeeperComponents/TimeKeepEditProfileModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

const TimeKeeperSetup = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigation = useNavigation();
  const {
    timeKeepInputName,
    timeKeepInputMotto,
    timeKeepInputImage,
    loadTimeKeepUserProfile,
    setTimeKeepInputName,
    setTimeKeepInputMotto,
    setTimeKeepInputImage,
    isOnNotification,
    setIsOnNotification,
  } = useStore();

  useEffect(() => {
    loadTimeKeepUserProfile();
  }, []);

  const handleResetTimeKeepProgress = async () => {
    try {
      await AsyncStorage.multiRemove([
        'time-keep-user-profile',
        'timekeep_reminders',
        'timekeep_workouts',
        'timekeep_workout_memories',
        'timekeep_stories',
      ]);

      setTimeKeepInputName('');
      setTimeKeepInputMotto('');
      setTimeKeepInputImage(null);

      if (isOnNotification) {
        Toast.show({ type: 'success', text1: 'Progress reset successfully!' });
      }

      navigation.navigate('TimeKeeperOnboard');
    } catch (error) {
      console.log('Error', error);
    }
  };

  const toggleNotifications = async val => {
    Toast.show({
      text1: !isOnNotification
        ? 'Notifications turned on!'
        : 'Notifications turned off!',
    });

    try {
      await AsyncStorage.setItem(
        'time_keep_notifications',
        JSON.stringify(val),
      );
      setIsOnNotification(val);
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <TimeKeepLayout>
      <View style={styles.timekeepcn}>
        <View style={{ marginBottom: 30 }}>
          <Text style={styles.timekeeptitle}>Settings</Text>
        </View>

        <View style={styles.timekeeepregcn}>
          <Text style={styles.timekeeptitle}>Your profile</Text>

          <Image
            source={{ uri: timeKeepInputImage }}
            style={{
              width: 140,
              height: 140,
              borderRadius: 10,
              marginTop: 30,
              alignSelf: 'center',
            }}
          />

          <Text style={styles.timekeepnametxt}>{timeKeepInputName}</Text>
          <Text style={styles.timekeepdescription}>{timeKeepInputMotto}</Text>

          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 26 }}
            activeOpacity={0.7}
            onPress={() => setShowEditProfile(true)}
          >
            <LinearGradient
              colors={['#002640', '#FFFFFF36']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.timekeepbtngradborder}
            >
              <View style={[styles.timekeepbtnborders, { width: 226 }]}>
                <View style={styles.timekeepbtnwrp}>
                  <Text style={styles.timekeepbtntext}>CHANGE PROFILE</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={[styles.timekeeepregcn, { marginTop: 30 }]}>
          <TouchableOpacity
            onPress={() => toggleNotifications(!isOnNotification)}
            activeOpacity={0.9}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 30,
            }}
          >
            <Text style={styles.timekeepnottxt}>Notification</Text>
            {isOnNotification ? (
              <Image source={require('../../assets/images/timekeepnotf.png')} />
            ) : (
              <Image
                source={require('../../assets/images/timekeepnotf.png')}
                style={{ opacity: 0.5, transform: [{ rotate: '180deg' }] }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: 'center', width: '100%' }}
            activeOpacity={0.7}
            onPress={() => handleResetTimeKeepProgress()}
          >
            <LinearGradient
              colors={['#002640', '#FFFFFF36']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.timekeepbtngradborder}
            >
              <View style={styles.timekeepbtnborders}>
                <View
                  style={[
                    styles.timekeepbtnwrp,
                    { backgroundColor: '#B02426' },
                  ]}
                >
                  <Text style={styles.timekeepbtntext}>RESET PROGRESS</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <TimeKeepEditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </TimeKeepLayout>
  );
};

const styles = StyleSheet.create({
  timekeepcn: {
    paddingTop: height * 0.1,
    paddingHorizontal: 18,
    paddingBottom: 140,
  },
  timekeeplogo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 20,
  },
  timekeeepregcn: {
    width: '100%',
    padding: 30,

    backgroundColor: '#1A1A1A',
    borderRadius: 30,
  },
  timekeeptitle: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  timekeepnottxt: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  timekeepnametxt: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  timekeepdescription: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    textAlign: 'center',
  },
  timekeepinput: {
    height: 46,
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
    width: 89,
    height: 89,
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
    textAlign: 'center',
  },
  timekeepbtnwrp: {
    height: 73,
    borderRadius: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#135CAA',
  },
  timekeepbtngradborder: { borderRadius: 10 },
  timekeepbtnborders: {
    padding: Platform.OS === 'ios' ? 1 : 0,
    margin: Platform.OS === 'ios' ? 0 : 1,
  },
});

export default TimeKeeperSetup;
