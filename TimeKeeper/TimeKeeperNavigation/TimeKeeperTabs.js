import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, StyleSheet } from 'react-native';

import TimeKeeperHome from '../TimeKeeperScreens/TimeKeeperHome';
import TimeKeeperSetup from '../TimeKeeperScreens/TimeKeeperSetup';
import TimeKeeperAbout from '../TimeKeeperScreens/TimeKeeperAbout';

const Tab = createBottomTabNavigator();

const TimeKeeperTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tab,
        tabBarActiveTintColor: '#135CAA',
        tabBarInactiveTintColor: '#fff',
        tabBarBackground: () => (
          <LinearGradient
            colors={['#0089C8', '#2B2B2B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.6 }}
            style={{ borderRadius: 30 }}
          >
            <LinearGradient
              colors={['#2B2B2B', '#2B2B2B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1.6 }}
              style={styles.tabBorders}
            />
          </LinearGradient>
        ),
      }}
    >
      <Tab.Screen
        name="TimeKeeperHome"
        component={TimeKeeperHome}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/timekeephm.png')}
              tintColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TimeKeeperSetup"
        component={TimeKeeperSetup}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/timekeepsett.png')}
              tintColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TimeKeeperAbout"
        component={TimeKeeperAbout}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/timekeepabout.png')}
              tintColor={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBorders: {
    height: 125,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: Platform.OS === 'ios' ? 1 : 0,
    margin: Platform.OS === 'ios' ? 0 : 1,
  },
  tab: {
    elevation: 0,
    paddingTop: 29,
    height: 120,
    paddingBottom: 2,
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRadius: 50,
    paddingHorizontal: 80,
  },
});

export default TimeKeeperTabs;
