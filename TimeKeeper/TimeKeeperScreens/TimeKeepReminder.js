import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import TimeKeepLayout from '../TimeKeeperComponents/TimeKeepLayout';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useStore } from '../TimeKeeperStore/timeKeeperContext';
import Orientation from 'react-native-orientation-locker';

const timeKeepSTORAGE_KEY = 'timekeep_reminders';
const { height: timeKeepHeight } = Dimensions.get('window');

const TimeKeepReminder = () => {
  const navigation = useNavigation();
  const [timeKeepReminders, setTimeKeepReminders] = useState([]);
  const [timeKeepDeleteModalVisible, setTimeKeepDeleteModalVisible] =
    useState(false);
  const [timeKeepReminderTitle, setTimeKeepReminderTitle] = useState('');
  const [timeKeepReminderDate, setTimeKeepReminderDate] = useState(null);
  const [timeKeepReminderTime, setTimeKeepReminderTime] = useState(null);
  const [timeKeepPickerMode, setTimeKeepPickerMode] = useState(null);
  const [timeKeepStoryToDelete, setTimeKeepStoryToDelete] = useState(null);
  const [timeKeepShowPicker, setTimeKeepShowPicker] = useState(false);
  const [timeKeepTempDate, setTimeKeepTempDate] = useState(new Date());
  const [timeKeepCreateMode, setTimeKeepCreateMode] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const { isOnNotification } = useStore();

  useEffect(() => {
    timeKeepLoadReminders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      Platform.OS === 'android' &&
        timeKeepDeleteModalVisible &&
        Orientation.lockToPortrait();
      return () => Orientation.unlockAllOrientations();
    }, [timeKeepDeleteModalVisible]),
  );

  useEffect(() => {
    timeKeepReminders.forEach(rem => {
      const delay = rem.timestamp - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          if (isOnNotification) {
            Toast.show({
              type: 'info',
              text1: rem.title || 'Time to train!',
            });
          }
        }, delay);
      }
    });
  }, [timeKeepReminders]);

  const timeKeepLoadReminders = async () => {
    try {
      const data = await AsyncStorage.getItem(timeKeepSTORAGE_KEY);
      if (data) setTimeKeepReminders(JSON.parse(data));
    } catch (e) {
      console.log('error', e);
    }
  };

  const timeKeepSaveReminders = async updated => {
    try {
      setTimeKeepReminders(updated);
      await AsyncStorage.setItem(timeKeepSTORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log('Save reminders error', e);
    }
  };

  const timeKeepHandleAdd = async () => {
    if (
      !timeKeepReminderTitle ||
      !timeKeepReminderDate ||
      !timeKeepReminderTime
    )
      return;

    const dateTime = new Date(
      timeKeepReminderDate.getFullYear(),
      timeKeepReminderDate.getMonth(),
      timeKeepReminderDate.getDate(),
      timeKeepReminderTime.getHours(),
      timeKeepReminderTime.getMinutes(),
    );

    if (editingReminder) {
      const updated = timeKeepReminders.map(r =>
        r.id === editingReminder.id
          ? {
              ...r,
              title: timeKeepReminderTitle,
              date: timeKeepReminderDate.toLocaleDateString(),
              time: timeKeepReminderTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              timestamp: dateTime.getTime(),
            }
          : r,
      );
      await timeKeepSaveReminders(updated);
      if (isOnNotification) {
        Toast.show({ type: 'success', text1: 'Reminder updated!' });
      }
    } else {
      const newRem = {
        id: Date.now().toString(),
        title: timeKeepReminderTitle,
        date: timeKeepReminderDate.toLocaleDateString(),
        time: timeKeepReminderTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        timestamp: dateTime.getTime(),
      };
      const updated = [newRem, ...timeKeepReminders];
      await timeKeepSaveReminders(updated);
      if (isOnNotification) {
        Toast.show({ type: 'success', text1: 'Reminder saved!' });
      }
    }

    const delay = dateTime.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        if (isOnNotification) {
          Toast.show({ type: 'info', text1: timeKeepReminderTitle });
        }
      }, delay);
    }

    setTimeKeepReminderTitle('');
    setTimeKeepReminderDate(null);
    setTimeKeepReminderTime(null);
    setEditingReminder(null);
    setTimeKeepCreateMode(false);
  };

  const timeKeepEditReminder = reminder => {
    setEditingReminder(reminder);
    setTimeKeepReminderTitle(reminder.title);
    const parsedDate = new Date(reminder.timestamp);
    setTimeKeepReminderDate(parsedDate);
    setTimeKeepReminderTime(parsedDate);
    setTimeKeepCreateMode(true);
  };

  const timeKeepConfirmDelete = reminder => {
    setTimeKeepStoryToDelete(reminder);
    setTimeKeepDeleteModalVisible(true);
  };

  const timeKeepDeleteReminder = async () => {
    const updated = timeKeepReminders.filter(
      r => r.id !== timeKeepStoryToDelete.id,
    );
    await timeKeepSaveReminders(updated);
    setTimeKeepDeleteModalVisible(false);
  };

  const timeKeepOpenPicker = mode => {
    setTimeKeepPickerMode(mode);
    setTimeKeepTempDate(new Date());
    setTimeKeepShowPicker(true);
  };

  const timeKeepOnChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setTimeKeepShowPicker(false);
    if (selectedDate) {
      if (timeKeepPickerMode === 'date') {
        setTimeKeepReminderDate(selectedDate);
      } else if (timeKeepPickerMode === 'time') {
        setTimeKeepReminderTime(selectedDate);
      }
    }
  };

  return (
    <TimeKeepLayout>
      <View style={styles.timeKeepContainer}>
        <View style={styles.timeKeepHeaderRow}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            onPress={() =>
              timeKeepCreateMode
                ? (setTimeKeepCreateMode(false), setEditingReminder(null))
                : navigation.goBack()
            }
          >
            <Image source={require('../../assets/images/timekeepback.png')} />
            <Text style={styles.timeKeepHeader}>
              {timeKeepCreateMode
                ? editingReminder
                  ? 'Edit Reminder'
                  : 'Create Reminder'
                : 'Reminder'}
            </Text>
          </TouchableOpacity>
          {!timeKeepCreateMode && (
            <TouchableOpacity
              onPress={() => {
                setEditingReminder(null);
                setTimeKeepCreateMode(true);
              }}
            >
              <Text style={styles.timeKeepPlus}>＋</Text>
            </TouchableOpacity>
          )}
        </View>

        {!timeKeepCreateMode ? (
          timeKeepReminders.length === 0 ? (
            <Text style={styles.timeKeepEmptyText}>
              You don’t have reminders yet.
            </Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {timeKeepReminders.map(rem => (
                <View key={rem.id} style={styles.timeKeepReminderCard}>
                  <Text style={styles.timeKeepReminderTitle}>{rem.title}</Text>
                  <View style={styles.timeKeepReminderRow}>
                    <View style={styles.timeKeepIconBox}>
                      <Image
                        source={require('../../assets/images/timekeeptime.png')}
                      />
                      <Text style={styles.timeKeepReminderText}>
                        {rem.time}
                      </Text>
                    </View>
                    <View style={styles.timeKeepIconBox}>
                      <Image
                        source={require('../../assets/images/timekeepvcallendar.png')}
                      />
                      <Text style={styles.timeKeepReminderText}>
                        {rem.date}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.timeKeepButtonsRow}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => timeKeepEditReminder(rem)}
                    >
                      <LinearGradient
                        colors={['#002640', '#FFFFFF36']}
                        style={[styles.timeKeepBtnGradBorder, { width: 127 }]}
                      >
                        <View style={styles.timeKeepBtnBorders}>
                          <View
                            style={[
                              styles.timeKeepBtnWrapper,
                              { backgroundColor: '#135CAA' },
                            ]}
                          >
                            <Text style={styles.timeKeepBtnText}>CHANGE</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => timeKeepConfirmDelete(rem)}
                    >
                      <LinearGradient
                        colors={['#002640', '#FFFFFF36']}
                        style={[styles.timeKeepBtnGradBorder, { width: 127 }]}
                      >
                        <View style={styles.timeKeepBtnBorders}>
                          <View
                            style={[
                              styles.timeKeepBtnWrapper,
                              { backgroundColor: '#B02426' },
                            ]}
                          >
                            <Text style={styles.timeKeepBtnText}>DELETE</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )
        ) : (
          <View style={[styles.timeKeepModalBox, { marginBottom: 40 }]}>
            <Text style={styles.timeKeepModalTitle}>
              {editingReminder ? 'Edit your reminder' : 'Create a reminder'}
            </Text>

            <TextInput
              placeholder="Reminder name"
              placeholderTextColor="#FFFFFF7D"
              style={styles.timeKeepInput}
              value={timeKeepReminderTitle}
              onChangeText={setTimeKeepReminderTitle}
              maxLength={15}
            />

            <TouchableOpacity
              style={styles.timeKeepInputRow}
              onPress={() => timeKeepOpenPicker('time')}
            >
              <Text style={styles.timeKeepInputText}>
                {timeKeepReminderTime
                  ? timeKeepReminderTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Choose a time'}
              </Text>
              <Image source={require('../../assets/images/timekeeptime.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeKeepInputRow}
              onPress={() => timeKeepOpenPicker('date')}
            >
              <Text style={styles.timeKeepInputText}>
                {timeKeepReminderDate
                  ? timeKeepReminderDate.toLocaleDateString()
                  : 'Choose a date'}
              </Text>
              <Image
                source={require('../../assets/images/timekeepvcallendar.png')}
              />
            </TouchableOpacity>
            {timeKeepReminderDate &&
              timeKeepReminderTime &&
              timeKeepReminderTitle && (
                <View
                  style={{ marginTop: 26, alignSelf: 'center', width: '90%' }}
                >
                  <TouchableOpacity onPress={timeKeepHandleAdd}>
                    <LinearGradient
                      colors={['#002640', '#FFFFFF36']}
                      style={styles.timeKeepBtnGradBorder}
                    >
                      <View style={[styles.timeKeepBtnBorders]}>
                        <View
                          style={[
                            styles.timeKeepBtnWrapper,
                            { backgroundColor: '#135CAA' },
                            { height: 73 },
                          ]}
                        >
                          <Text
                            style={[styles.timeKeepBtnText, { fontSize: 20 }]}
                          >
                            {editingReminder ? 'UPDATE' : 'SAVE'}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        )}

        {Platform.OS === 'ios' ? (
          <Modal visible={timeKeepShowPicker} transparent animationType="fade">
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={3}
              reducedTransparencyFallbackColor="#00000080"
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: '#1A1A1A',
                  borderRadius: 20,
                  padding: 20,
                  width: '85%',
                  alignItems: 'center',
                }}
              >
                <DateTimePicker
                  value={timeKeepTempDate}
                  mode={timeKeepPickerMode}
                  display="spinner"
                  onChange={timeKeepOnChange}
                  themeVariant="dark"
                />
                <TouchableOpacity
                  onPress={() => setTimeKeepShowPicker(false)}
                  style={{
                    marginTop: 20,
                    backgroundColor: '#135CAA',
                    borderRadius: 10,
                    paddingVertical: 12,
                    paddingHorizontal: 40,
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'RedHatDisplay-SemiBold',
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : (
          timeKeepShowPicker && (
            <DateTimePicker
              value={timeKeepTempDate}
              mode={timeKeepPickerMode}
              display="default"
              onChange={timeKeepOnChange}
            />
          )
        )}

        <Modal
          visible={timeKeepDeleteModalVisible}
          animationType="fade"
          transparent
          statusBarTranslucent={Platform.OS === 'android'}
        >
          {Platform.OS === 'ios' && (
            <BlurView
              style={styles.timeKeepModalBlur}
              blurType="dark"
              blurAmount={2}
            />
          )}
          <View style={styles.timeKeepOverlay}>
            <View style={styles.timeKeepDeleteBox}>
              <Text style={styles.timeKeepDeleteText}>Delete reminder?</Text>
              <View style={styles.timeKeepDeleteRow}>
                <TouchableOpacity
                  style={styles.timeKeepCancelBtn}
                  onPress={() => setTimeKeepDeleteModalVisible(false)}
                >
                  <Text style={styles.timeKeepCancelText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeKeepDelBtn}
                  onPress={timeKeepDeleteReminder}
                >
                  <Text style={styles.timeKeepDelText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TimeKeepLayout>
  );
};

const styles = StyleSheet.create({
  timeKeepContainer: {
    paddingTop: timeKeepHeight * 0.1,
    paddingHorizontal: 16,
  },
  timeKeepModalBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  timeKeepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeKeepHeader: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 22,
  },
  timeKeepPlus: { color: '#fff', fontSize: 28 },
  timeKeepEmptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 14,
  },
  timeKeepReminderCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    padding: 35,
    marginBottom: 20,
  },
  timeKeepReminderTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'RedHatDisplay-SemiBold',
    marginBottom: 10,
  },
  timeKeepReminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  timeKeepIconBox: {
    borderColor: '#5C5C5C',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    width: '47%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  timeKeepReminderText: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-Regular',
  },
  timeKeepButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  timeKeepBtnGradBorder: { borderRadius: 11 },
  timeKeepBtnBorders: {
    padding: Platform.OS === 'ios' ? 1 : 0,
    margin: Platform.OS === 'ios' ? 0 : 1,
  },
  timeKeepBtnWrapper: {
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeKeepBtnText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
  },
  timeKeepOverlay: {
    flex: 1,
    backgroundColor: '#002640b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeKeepModalBox: {
    backgroundColor: '#1A1A1A',
    width: '90%',
    borderRadius: 20,
    padding: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  timeKeepModalTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'RedHatDisplay-SemiBold',
    marginBottom: 21,
  },
  timeKeepInput: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    padding: 15,
    marginBottom: 21,
  },
  timeKeepInputRow: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 21,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeKeepInputText: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-Regular',
  },
  timeKeepDeleteBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    width: '80%',
    padding: 22,
    paddingVertical: 32,
  },
  timeKeepDeleteText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'RedHatDisplay-SemiBold',
    marginBottom: 30,
  },
  timeKeepDeleteRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  timeKeepCancelBtn: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  timeKeepCancelText: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
  },
  timeKeepDelBtn: {
    backgroundColor: '#B02426',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  timeKeepDelText: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
  },
});

export default TimeKeepReminder;
