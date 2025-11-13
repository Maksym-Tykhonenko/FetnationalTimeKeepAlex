import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useStore } from '../TimeKeeperStore/timeKeeperContext';

const timekeepbackground = [
  require('../../assets/images/timekeeponb1.png'),
  require('../../assets/images/timekeeponb2.png'),
  require('../../assets/images/timekeeponb3.png'),
  require('../../assets/images/timekeeponb4.png'),
];

const TimeKeeperOnboard = () => {
  const [currentTimeKeeperOnboardIdx, setCurrentTimeKeeperOnboardIdx] =
    useState(0);
  const navigation = useNavigation();
  const { timeKeepInputName, loadTimeKeepUserProfile, timeKeepInputImage } =
    useStore();

  useFocusEffect(
    useCallback(() => {
      loadTimeKeepUserProfile();
    }, []),
  );

  const handleTimeKeepContinue = () => {
    if (currentTimeKeeperOnboardIdx < 3) {
      setCurrentTimeKeeperOnboardIdx(currentTimeKeeperOnboardIdx + 1);
    } else {
      timeKeepInputName && timeKeepInputImage
        ? navigation.navigate('TimeKeeperTabs')
        : navigation.navigate('TimeKeepCreateAccount');
    }
  };

  return (
    <ImageBackground
      source={timekeepbackground[currentTimeKeeperOnboardIdx]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {currentTimeKeeperOnboardIdx === 3 && (
          <View style={{ alignSelf: 'center', marginBottom: 80 }}>
            {Platform.OS === 'ios' ? (
              <Image source={require('../../assets/images/timekeeponb5.png')} />
            ) : (
              <Image
                source={require('../../assets/images/andrlogo.png')}
                style={{ width: 220, height: 220, borderRadius: 50 }}
              />
            )}
          </View>
        )}

        <LinearGradient
          colors={['#0089C8', '#2B2B2B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 30,
          }}
        >
          <View style={{ padding: 1, paddingBottom: 0 }}>
            <View style={styles.timekeepwelcomecn}>
              <Text style={styles.timekeeptitle}>
                {currentTimeKeeperOnboardIdx === 0 && 'Rhythm of the day'}
                {currentTimeKeeperOnboardIdx === 1 && 'Your space of memories'}
                {currentTimeKeeperOnboardIdx === 2 && 'Your motto'}
                {currentTimeKeeperOnboardIdx === 3 && 'Privacy Policy'}
              </Text>
              <Text style={styles.timekeepdescription}>
                {currentTimeKeeperOnboardIdx === 0 &&
                  'Every movement has its own rhythm. Start your day with a workout that suits you. At the end, add a photo as a keepsake.'}
                {currentTimeKeeperOnboardIdx === 1 &&
                  'Write down short stories and moments that you want to keep. They will remain only with you.'}
                {currentTimeKeeperOnboardIdx === 2 &&
                  `Create your profile, add a photo, name and an inspiring phrase.
This is your motto - it will remind you every day why you play.`}

                {Platform.OS === 'ios' &&
                  currentTimeKeeperOnboardIdx === 3 &&
                  `Fetnational: Time Keep does not collect, store or transmit any of your personal data.
All photos, texts and settings are stored only on your device.
The application works completely offline and does not have access to the network.`}
                {Platform.OS === 'android' &&
                  currentTimeKeeperOnboardIdx === 3 &&
                  `888 Time Keep does not collect, store or transmit any of your personal data.
All photos, texts and settings are stored only on your device.
The application works completely offline and does not have access to the network.`}
              </Text>

              <Text></Text>
              <TouchableOpacity
                style={{ alignSelf: 'center', marginTop: 26 }}
                activeOpacity={0.7}
                onPress={() => {
                  handleTimeKeepContinue();
                }}
              >
                <LinearGradient
                  colors={['#002640', '#FFFFFF36']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.timekeepbtngradborder}
                >
                  <View style={styles.timekeepbtnborders}>
                    <View style={styles.timekeepbtnwrp}>
                      <Text style={styles.timekeepbtntext}>
                        {currentTimeKeeperOnboardIdx === 0 && 'CONTINUE'}
                        {currentTimeKeeperOnboardIdx === 1 && 'NEXT'}
                        {currentTimeKeeperOnboardIdx === 2 && 'START'}
                        {currentTimeKeeperOnboardIdx === 3 && 'OK'}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  timekeepwelcomecn: {
    width: '100%',
    padding: 30,
    paddingBottom: 60,
    backgroundColor: '#2B2B2B',
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
    borderBottomColor: '#2B2B2B',
  },
  timekeeptitle: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 22,
  },
  timekeepdescription: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 60,
  },

  // button

  timekeepbtn: {
    height: 73,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#135CAA',
    padding: 4,
  },
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

export default TimeKeeperOnboard;
