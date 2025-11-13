import { createStackNavigator } from '@react-navigation/stack';
import TimeKeeperOnboard from '../TimeKeeperScreens/TimeKeeperOnboard';
import TimeKeeperTabs from './TimeKeeperTabs';
import TimeKeepCreateAccount from '../TimeKeeperScreens/TimeKeepCreateAccount';
import TimeKeepAddStory from '../TimeKeeperScreens/TimeKeepAddStory';
import TimeKeepReminder from '../TimeKeeperScreens/TimeKeepReminder';
import TimeKeepWorkout from '../TimeKeeperScreens/TimeKeepWorkout';
import TimeKeeperMemories from '../TimeKeeperScreens/TimeKeeperMemories';

const Stack = createStackNavigator();

const TimeKeeperStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TimeKeeperOnboard" component={TimeKeeperOnboard} />
      <Stack.Screen
        name="TimeKeepCreateAccount"
        component={TimeKeepCreateAccount}
      />
      <Stack.Screen name="TimeKeeperTabs" component={TimeKeeperTabs} />
      <Stack.Screen name="TimeKeepAddStory" component={TimeKeepAddStory} />
      <Stack.Screen name="TimeKeepReminder" component={TimeKeepReminder} />
      <Stack.Screen name="TimeKeepWorkout" component={TimeKeepWorkout} />
      <Stack.Screen name="TimeKeeperMemories" component={TimeKeeperMemories} />
    </Stack.Navigator>
  );
};

export default TimeKeeperStack;
