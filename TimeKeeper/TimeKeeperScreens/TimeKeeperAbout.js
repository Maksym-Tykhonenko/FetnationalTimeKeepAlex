import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TimeKeepLayout from '../TimeKeeperComponents/TimeKeepLayout';

const { height } = Dimensions.get('window');

const TimeKeeperHome = () => {
  const shareTimeKeepAboutInfo = async () => {
    try {
      await Share.share({
        message:
          Platform.OS === 'ios'
            ? `Fetnational: Time Keep is your personal offline space for memories and
focus. Add stories with photos and keep them as part of your private
collection. Create workouts, set a timer, and add a photo when you’re
done — everything stays saved in your training memories. You can also
set reminders for any date and time, give them names, and get
notifications on your phone. Fetnational: Time Keep helps you stay
organized, mindful, and in rhythm with yourself.`
            : `888 Time Keep is your personal offline space for memories and
focus. Add stories with photos and keep them as part of your private
collection. Create workouts, set a timer, and add a photo when you’re
done — everything stays saved in your training memories. You can also
set reminders for any date and time, give them names, and get
notifications on your phone. Fetnational: Time Keep helps you stay
organized, mindful, and in rhythm with yourself.`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <TimeKeepLayout>
      <View style={styles.timekeepcn}>
        <View style={{ marginBottom: 30 }}>
          <Text style={styles.timekeeptitle}>About the app</Text>
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

        {Platform.OS === 'ios' ? (
          <Text style={styles.timekeepdescription}>
            Fetnational: Time Keep is your personal offline space for memories
            and focus. Add stories with photos and keep them as part of your
            private collection. Create workouts, set a timer, and add a photo
            when you’re done — everything stays saved in your training memories.
            You can also set reminders for any date and time, give them names,
            and get notifications on your phone. Fetnational: Time Keep helps
            you stay organized, mindful, and in rhythm with yourself.
          </Text>
        ) : (
          <Text style={styles.timekeepdescription}>
            888 Time Keep is your personal offline space for memories and focus.
            Add stories with photos and keep them as part of your private
            collection. Create workouts, set a timer, and add a photo when
            you’re done — everything stays saved in your training memories. You
            can also set reminders for any date and time, give them names, and
            get notifications on your phone. Fetnational: Time Keep helps you
            stay organized, mindful, and in rhythm with yourself.
          </Text>
        )}
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 15 }}
        >
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            activeOpacity={0.7}
            onPress={shareTimeKeepAboutInfo}
          >
            <LinearGradient
              colors={['#002640', '#FFFFFF36']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.timekeepbtngradborder}
            >
              <View style={[styles.timekeepbtnborders, { width: 127 }]}>
                <View style={styles.timekeepbtnwrp}>
                  <Text style={styles.timekeepbtntext}>SHARE</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={{ alignSelf: 'center' }}
              activeOpacity={0.7}
              onPress={() =>
                Linking.openURL(
                  'https://apps.apple.com/us/app/fetnational-time-keep/id6754980185',
                )
              }
            >
              <LinearGradient
                colors={['#002640', '#FFFFFF36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timekeepbtngradborder}
              >
                <View style={[styles.timekeepbtnborders, { width: 57 }]}>
                  <View style={styles.timekeepbtnwrp}>
                    <Image
                      source={require('../../assets/images/shareapp.png')}
                    />
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
    paddingHorizontal: 23,
    paddingBottom: 140,
  },
  timekeeplogo: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginBottom: 30,
    borderRadius: 32,
  },
  timekeeptitle: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  timekeepdescription: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },
  timekeepphotoGradient: {
    borderRadius: 10,
  },
  // button
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
  timekeepbtngradborder: { borderRadius: 10 },
  timekeepbtnborders: {
    padding: Platform.OS === 'ios' ? 1 : 0,
    margin: Platform.OS === 'ios' ? 0 : 1,
  },
});

export default TimeKeeperHome;
