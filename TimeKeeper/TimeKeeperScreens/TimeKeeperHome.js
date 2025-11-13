import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const TimeKeeperHome = () => {
  const navigation = useNavigation();
  const {
    timeKeepInputName,
    timeKeepInputMotto,
    timeKeepInputImage,
    loadTimeKeepUserProfile,
    setIsOnNotification,
  } = useStore();

  useFocusEffect(
    useCallback(() => {
      loadTimeKeepUserProfile();
      loadTimeKeepSettings();
    }, []),
  );

  const loadTimeKeepSettings = async () => {
    try {
      const notifValue = await AsyncStorage.getItem('time_keep_notifications');
      if (notifValue !== null) setIsOnNotification(JSON.parse(notifValue));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TimeKeepLayout>
      <View style={styles.timekeepcn}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            gap: 15,
          }}
        >
          <Image
            source={{ uri: timeKeepInputImage }}
            style={styles.timekeepphoto}
          />
          <View style={{}}>
            <Text style={styles.timekeeptitle}>Hi, {timeKeepInputName}</Text>
            <Text style={styles.timekeepdescription}>{timeKeepInputMotto}</Text>
          </View>
        </View>

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
        <TouchableOpacity
          style={{ alignSelf: 'center', width: '62%' }}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TimeKeepAddStory')}
        >
          <LinearGradient
            colors={['#002640', '#FFFFFF36']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.timekeepbtngradborder}
          >
            <View style={styles.timekeepbtnborders}>
              <View style={styles.timekeepbtnwrp}>
                <Text style={styles.timekeepbtntext}>ADD YOUR STORY</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: 20, width: '62%' }}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TimeKeepWorkout')}
        >
          <LinearGradient
            colors={['#002640', '#FFFFFF36']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.timekeepbtngradborder}
          >
            <View style={styles.timekeepbtnborders}>
              <View style={styles.timekeepbtnwrp}>
                <Text style={styles.timekeepbtntext}>CREATE A WORKOUT</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: 20, width: '62%' }}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TimeKeeperMemories')}
        >
          <LinearGradient
            colors={['#002640', '#FFFFFF36']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.timekeepbtngradborder}
          >
            <View style={styles.timekeepbtnborders}>
              <View style={styles.timekeepbtnwrp}>
                <Text style={styles.timekeepbtntext}>TRAINING MEMORIES</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: 20, width: '62%' }}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TimeKeepReminder')}
        >
          <LinearGradient
            colors={['#002640', '#FFFFFF36']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.timekeepbtngradborder}
          >
            <View style={styles.timekeepbtnborders}>
              <View style={styles.timekeepbtnwrp}>
                <Text style={styles.timekeepbtntext}>REMINDER</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TimeKeepLayout>
  );
};

const styles = StyleSheet.create({
  timekeepcn: {
    paddingTop: height * 0.1,
    paddingHorizontal: 30,
    paddingBottom: 140,
  },
  timekeeplogo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 20,
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
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  timekeepdescription: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
    width: '80%',
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
    fontSize: 18,
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
    textAlign: 'center',
  },
  timekeepbtnwrp: {
    height: 73,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#135CAA',
    paddingHorizontal: 8,
  },
  timekeepbtngradborder: { borderRadius: 10 },
  timekeepbtnborders: {
    padding: Platform.OS === 'ios' ? 1 : 0,
    margin: Platform.OS === 'ios' ? 0 : 1,
  },
});

export default TimeKeeperHome;
