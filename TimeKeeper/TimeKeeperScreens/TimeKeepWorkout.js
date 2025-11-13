import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  Share,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import TimeKeepLayout from '../TimeKeeperComponents/TimeKeepLayout';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Svg, { Circle } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore } from '../TimeKeeperStore/timeKeeperContext';
import Orientation from 'react-native-orientation-locker';

const { height: timeKeepHeight } = Dimensions.get('window');

const timeKeepSTORAGE_WORKOUTS = 'timekeep_workouts';
const timeKeepSTORAGE_MEMORIES = 'timekeep_workout_memories';

const CIRCLE_SIZE = 260;
const STROKE = 8;
const R = (CIRCLE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const TimeKeepWorkout = () => {
  const navigation = useNavigation();
  const [timeKeepStage, setTimeKeepStage] = useState('list');
  const [timeKeepDeleteVisible, setTimeKeepDeleteVisible] = useState(false);
  const [timeKeepWorkoutToDelete, setTimeKeepWorkoutToDelete] = useState(null);
  const { setTimeKeepWorkoutMemories, isOnNotification } = useStore();
  const [timeKeepWorkouts, setTimeKeepWorkouts] = useState([]);
  const [timeKeepMemories, setTimeKeepMemories] = useState([]);
  const [timeKeepWorkoutTitle, setTimeKeepWorkoutTitle] = useState('');
  const [timeKeepDurationMin, setTimeKeepDurationMin] = useState(30);
  const [timeKeepShowPicker, setTimeKeepShowPicker] = useState(false);
  const [timeKeepPickerMode, setTimeKeepPickerMode] = useState('time');
  const [timeKeepTempDate, setTimeKeepTempDate] = useState(
    new Date(0, 0, 0, 0, 30, 0),
  );
  const [timeKeepTimeLeft, setTimeKeepTimeLeft] = useState(0);
  const [timeKeepSelectedWorkout, setTimeKeepSelectedWorkout] = useState(null);
  const timeKeepTimerRef = useRef(null);
  const timeKeepProgress = useRef(new Animated.Value(0)).current;
  const [timeKeepFinishVisible, setTimeKeepFinishVisible] = useState(false);
  const [timeKeepEmotionText, setTimeKeepEmotionText] = useState('');
  const [timeKeepMemoryPhoto, setTimeKeepMemoryPhoto] = useState(null);

  useFocusEffect(
    useCallback(() => {
      Platform.OS === 'android' &&
        (timeKeepFinishVisible || timeKeepDeleteVisible) &&
        Orientation.lockToPortrait();

      return () => Orientation.unlockAllOrientations();
    }, [timeKeepFinishVisible, timeKeepDeleteVisible]),
  );

  useEffect(() => {
    (async () => {
      try {
        const w = await AsyncStorage.getItem(timeKeepSTORAGE_WORKOUTS);
        const m = await AsyncStorage.getItem(timeKeepSTORAGE_MEMORIES);
        if (w) setTimeKeepWorkouts(JSON.parse(w));
        if (m) {
          const parsed = JSON.parse(m);
          setTimeKeepMemories(parsed);
          setTimeKeepWorkoutMemories(parsed);
        }
      } catch (e) {
        console.log('Load error', e);
      }
    })();
  }, []);

  const timeKeepSaveWorkouts = async arr => {
    setTimeKeepWorkouts(arr);
    await AsyncStorage.setItem(timeKeepSTORAGE_WORKOUTS, JSON.stringify(arr));
  };

  const timeKeepSaveMemories = async arr => {
    setTimeKeepMemories(arr);
    setTimeKeepWorkoutMemories(arr);
    await AsyncStorage.setItem(timeKeepSTORAGE_MEMORIES, JSON.stringify(arr));
  };

  const timeKeepOpenDurationPicker = () => {
    setTimeKeepPickerMode('time');
    setTimeKeepShowPicker(true);
  };

  const timeKeepOnChangeDuration = (event, selectedDate) => {
    if (Platform.OS === 'android') setTimeKeepShowPicker(false);
    if (selectedDate) {
      const mins = selectedDate.getHours() * 60 + selectedDate.getMinutes();
      const safe = Math.max(mins, 1);
      setTimeKeepDurationMin(safe);
      setTimeKeepTempDate(selectedDate);
    }
  };

  const timeKeepAddWorkout = async () => {
    if (!timeKeepWorkoutTitle.trim() || !timeKeepDurationMin) return;
    const newW = {
      id: Date.now().toString(),
      title: timeKeepWorkoutTitle.trim(),
      durationMin: timeKeepDurationMin,
    };
    const updated = [newW, ...timeKeepWorkouts];
    await timeKeepSaveWorkouts(updated);
    setTimeKeepWorkoutTitle('');
    setTimeKeepStage('list');

    if (isOnNotification) {
      Toast.show({ type: 'success', text1: 'Workout created!' });
    }
  };

  const timeKeepDeleteWorkout = async id => {
    const updated = timeKeepWorkouts.filter(w => w.id !== id);
    await timeKeepSaveWorkouts(updated);
  };

  const timeKeepStartWorkout = workout => {
    if (timeKeepTimerRef.current) clearInterval(timeKeepTimerRef.current);
    setTimeKeepSelectedWorkout(workout);
    setTimeKeepTimeLeft(workout.durationMin * 60);
    setTimeKeepStage('timer');

    timeKeepProgress.setValue(0);
    Animated.timing(timeKeepProgress, {
      toValue: 1,
      duration: workout.durationMin * 60 * 1000,
      useNativeDriver: false,
    }).start();

    timeKeepTimerRef.current = setInterval(() => {
      setTimeKeepTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timeKeepTimerRef.current);
          Toast.show({ type: 'info', text1: 'Workout complete!' });
          setTimeKeepFinishVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeKeepTimerRef.current) clearInterval(timeKeepTimerRef.current);
    };
  }, []);

  const timeKeepFormatTime = s => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const hh = h > 0 ? `${String(h).padStart(2, '0')}:` : '';
    return `${hh}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const timeKeepDashOffset = timeKeepProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CIRCUMFERENCE],
  });

  const timeKeepPickPhoto = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
      resp => {
        const uri = resp?.assets?.[0]?.uri;
        if (uri) setTimeKeepMemoryPhoto(uri);
      },
    );
  };

  const timeKeepSaveMemory = async () => {
    if (!timeKeepSelectedWorkout) return;
    const newMemory = {
      id: Date.now().toString(),
      title: timeKeepSelectedWorkout.title,
      durationMin: timeKeepSelectedWorkout.durationMin,
      date: new Date().toISOString(),
      emotion: timeKeepEmotionText.trim(),
      photo: timeKeepMemoryPhoto || null,
    };
    const updated = [newMemory, ...timeKeepMemories];
    await timeKeepSaveMemories(updated);

    setTimeKeepEmotionText('');
    setTimeKeepMemoryPhoto(null);
    setTimeKeepFinishVisible(false);
    setTimeKeepSelectedWorkout(null);
    setTimeKeepTimeLeft(0);
    setTimeKeepStage('list');

    if (isOnNotification) {
      Toast.show({ type: 'success', text1: 'Saved to memories!' });
    }
  };

  const timeKeepShare = async () => {
    const msg = timeKeepEmotionText?.trim();
    try {
      const message = msg || 'My workout progress';

      await Share.share({ message });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const durationLabel = () => {
    const h = Math.floor(timeKeepDurationMin / 60);
    const m = timeKeepDurationMin % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    }
    return `00:${String(m).padStart(2, '0')}:00`;
  };

  return (
    <TimeKeepLayout>
      <View style={styles.timeKeepContainer}>
        <View style={styles.timeKeepHeaderRow}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            onPress={() => {
              if (timeKeepStage === 'list') navigation.goBack();
              else {
                if (timeKeepStage === 'timer' && timeKeepTimerRef.current) {
                  clearInterval(timeKeepTimerRef.current);
                }
                setTimeKeepStage('list');
              }
            }}
          >
            <Image source={require('../../assets/images/timekeepback.png')} />
            <Text style={styles.timeKeepHeader}>
              {timeKeepStage === 'list'
                ? 'Workout'
                : timeKeepStage === 'create'
                ? 'Create Workout'
                : timeKeepStage === 'timer'
                ? 'Workout'
                : timeKeepStage === 'memories'
                ? 'Memories'
                : 'Workout'}
            </Text>
          </TouchableOpacity>

          {timeKeepStage === 'list' && (
            <TouchableOpacity onPress={() => setTimeKeepStage('create')}>
              <Text style={styles.timeKeepPlus}>＋</Text>
            </TouchableOpacity>
          )}
        </View>

        {timeKeepStage === 'list' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {timeKeepWorkouts.length === 0 ? (
              <Text style={styles.timeKeepEmptyText}>
                No workouts yet. Create your first one.
              </Text>
            ) : (
              timeKeepWorkouts.map(w => (
                <View key={w.id} style={styles.timeKeepCard}>
                  <Text style={styles.timeKeepCardTitle}>{w.title}</Text>
                  <Text style={styles.timeKeepCardText}>
                    Duration: {w.durationMin} min
                  </Text>

                  <View style={styles.timeKeepButtonsRow}>
                    <TouchableOpacity onPress={() => timeKeepStartWorkout(w)}>
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
                            <Text style={styles.timeKeepBtnText}>START</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setTimeKeepWorkoutToDelete(w);
                        setTimeKeepDeleteVisible(true);
                      }}
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
              ))
            )}
          </ScrollView>
        )}

        {timeKeepStage === 'create' && (
          <View style={[styles.timeKeepModalBox, { marginBottom: 40 }]}>
            <Text style={styles.timeKeepModalTitle}>Create a workout</Text>

            <TextInput
              placeholder="Workout name"
              placeholderTextColor="#FFFFFF7D"
              style={styles.timeKeepInput}
              value={timeKeepWorkoutTitle}
              onChangeText={setTimeKeepWorkoutTitle}
            />

            <TouchableOpacity
              style={styles.timeKeepInputRow}
              onPress={timeKeepOpenDurationPicker}
            >
              <Text style={styles.timeKeepInputText}>{durationLabel()}</Text>
              <Image source={require('../../assets/images/timekeeptime.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={timeKeepAddWorkout}
              style={{ marginTop: 6 }}
            >
              <LinearGradient
                colors={['#002640', '#FFFFFF36']}
                style={styles.timeKeepBtnGradBorder}
              >
                <View style={styles.timeKeepBtnBorders}>
                  <View
                    style={[
                      styles.timeKeepBtnWrapper,
                      { backgroundColor: '#135CAA', height: 73 },
                    ]}
                  >
                    <Text style={[styles.timeKeepBtnText, { fontSize: 20 }]}>
                      SAVE
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {timeKeepStage === 'timer' && (
          <View
            style={{ alignItems: 'center', marginTop: 20, marginBottom: 30 }}
          >
            <View
              style={{
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50,
              }}
            >
              <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                <Circle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={R}
                  stroke="#2B2B2B"
                  strokeWidth={STROKE}
                  fill="none"
                />

                <AnimatedCircle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={R}
                  stroke="#00BFFF"
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={timeKeepDashOffset}
                  strokeLinecap="round"
                />
              </Svg>

              <Text style={styles.timeKeepTimerText}>
                {timeKeepFormatTime(timeKeepTimeLeft)}
              </Text>
            </View>
            {!!timeKeepSelectedWorkout && (
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'RedHatDisplay-Regular',
                  fontSize: 24,
                  marginTop: 60,
                  marginBottom: 10,
                  textAlign: 'center',
                }}
              >
                {timeKeepSelectedWorkout.title}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                if (timeKeepTimerRef.current)
                  clearInterval(timeKeepTimerRef.current);
                setTimeKeepFinishVisible(true);
              }}
              style={{ marginTop: 26 }}
            >
              <LinearGradient
                colors={['#002640', '#FFFFFF36']}
                style={[styles.timeKeepBtnGradBorder, { width: 226 }]}
              >
                <View style={styles.timeKeepBtnBorders}>
                  <View
                    style={[
                      styles.timeKeepBtnWrapper,
                      { backgroundColor: '#135CAA' },
                      { height: 73 },
                    ]}
                  >
                    <Text style={[styles.timeKeepBtnText, { fontSize: 18 }]}>
                      FINISH TRAINING
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {Platform.OS === 'ios' ? (
          <Modal
            visible={timeKeepShowPicker}
            transparent
            animationType="fade"
            statusBarTranslucent
          >
            <BlurView
              style={RNStyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={2}
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
                  themeVariant="dark"
                  textColor="#fff"
                  onChange={timeKeepOnChangeDuration}
                  style={{ width: '100%' }}
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
                      fontSize: 16,
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
              onChange={timeKeepOnChangeDuration}
            />
          )
        )}

        <Modal
          visible={timeKeepFinishVisible}
          transparent
          animationType="fade"
          statusBarTranslucent={Platform.OS === 'android'}
        >
          {Platform.OS === 'ios' && (
            <BlurView
              style={RNStyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={2}
            />
          )}
          <View style={styles.timeKeepOverlay}>
            <View style={styles.timeKeepFinishBox}>
              <Text style={styles.timeKeepFinishTitle}>
                Well done! You finished your workout!
              </Text>
              <Text style={styles.timeKeepFinishSub}>
                Leave a photo as a keepsake and describe your emotions
              </Text>

              <LinearGradient
                colors={['#0089C8', '#2B2B2B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.timekeepphotoGradient}
              >
                <View style={{ padding: 1 }}>
                  {timeKeepMemoryPhoto ? (
                    <Image
                      source={{ uri: timeKeepMemoryPhoto }}
                      style={styles.timekeepphoto}
                    />
                  ) : (
                    <View style={styles.timekeepwelcomecn}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={timeKeepPickPhoto}
                      >
                        <Image
                          source={require('../../assets/images/timekeeppicker.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {timeKeepMemoryPhoto && (
                    <TouchableOpacity
                      style={styles.timekeeppickaddphoto}
                      onPress={timeKeepPickPhoto}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require('../../assets/images/timekeeppicker.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>

              <TextInput
                placeholder="I feel..."
                placeholderTextColor="#FFFFFF7D"
                style={styles.timeKeepInput}
                value={timeKeepEmotionText}
                onChangeText={setTimeKeepEmotionText}
                multiline
              />

              {timeKeepMemoryPhoto && timeKeepEmotionText && (
                <TouchableOpacity onPress={timeKeepSaveMemory}>
                  <LinearGradient
                    colors={['#002640', '#FFFFFF36']}
                    style={[
                      styles.timeKeepBtnGradBorder,
                      { width: '90%', alignSelf: 'center' },
                    ]}
                  >
                    <View style={styles.timeKeepBtnBorders}>
                      <View
                        style={[
                          styles.timeKeepBtnWrapper,
                          { backgroundColor: '#135CAA', height: 73 },
                        ]}
                      >
                        <Text
                          style={[styles.timeKeepBtnText, { fontSize: 20 }]}
                        >
                          SAVE
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
            {timeKeepEmotionText && timeKeepMemoryPhoto && (
              <TouchableOpacity onPress={timeKeepShare}>
                <LinearGradient
                  colors={['#002640', '#FFFFFF36']}
                  style={[
                    styles.timeKeepBtnGradBorder,
                    { width: 127, marginTop: 20 },
                  ]}
                >
                  <View style={styles.timeKeepBtnBorders}>
                    <View
                      style={[
                        styles.timeKeepBtnWrapper,
                        { backgroundColor: '#135CAA', height: 55 },
                      ]}
                    >
                      <Text style={[styles.timeKeepBtnText, { fontSize: 16 }]}>
                        SHARE
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      </View>
      <Modal
        visible={timeKeepDeleteVisible}
        transparent
        animationType="fade"
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
            <Text style={styles.timeKeepDeleteText}>Delete workout?</Text>
            <View style={styles.timeKeepDeleteRow}>
              <TouchableOpacity
                style={styles.timeKeepCancelBtn}
                onPress={() => setTimeKeepDeleteVisible(false)}
              >
                <Text style={styles.timeKeepCancelText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timeKeepDelBtn}
                onPress={async () => {
                  if (timeKeepWorkoutToDelete) {
                    await timeKeepDeleteWorkout(timeKeepWorkoutToDelete.id);
                  }
                  setTimeKeepDeleteVisible(false);
                  setTimeKeepWorkoutToDelete(null);
                }}
              >
                <Text style={styles.timeKeepDelText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TimeKeepLayout>
  );
};

const styles = StyleSheet.create({
  timeKeepContainer: {
    paddingTop: timeKeepHeight * 0.1,
    paddingHorizontal: 16,
  },
  timeKeepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeKeepModalBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  timeKeepDeleteBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    width: '70%',
    padding: 24,
    alignItems: 'center',
  },
  timeKeepDeleteText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RedHatDisplay-SemiBold',
    marginBottom: 20,
  },
  timeKeepDeleteRow: {
    flexDirection: 'row',
    gap: 20,
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
    fontSize: 14,
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
    fontSize: 14,
  },
  timekeepphotoGradient: {
    borderRadius: 10,
    width: '50%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  timekeepphoto: {
    width: '100%',
    height: 159,
    borderRadius: 10,
  },
  timekeepwelcomecn: {
    width: '100%',
    padding: 30,
    height: 159,
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
  timeKeepCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    padding: 30,
    marginBottom: 20,
  },
  timeKeepCardTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'RedHatDisplay-SemiBold',
    marginBottom: 10,
  },
  timeKeepCardText: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-Regular',
    marginBottom: 6,
  },
  timeKeepButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
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
    paddingHorizontal: 14,
  },
  timeKeepBtnText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
  },
  timeKeepModalBox: {
    backgroundColor: '#1A1A1A',
    width: '90%',
    borderRadius: 20,
    padding: 30,
    alignSelf: 'center',
    marginTop: 10,
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
  timeKeepTimerText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 40,
    fontFamily: 'RedHatDisplay-SemiBold',
    textAlign: 'center',
  },
  timeKeepOverlay: {
    flex: 1,
    backgroundColor: '#00264078',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeKeepFinishBox: {
    backgroundColor: '#1A1A1A',
    width: '90%',
    borderRadius: 20,
    padding: 26,
  },
  timeKeepFinishTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'RedHatDisplay-SemiBold',
    marginBottom: 13,
  },
  timeKeepFinishSub: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'RedHatDisplay-Regular',
    marginBottom: 30,
  },
  timeKeepPhotoCard: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5C5C5C',
    marginBottom: 14,
    overflow: 'hidden',
  },
  timeKeepPhoto: { width: '100%', height: '100%' },
  timeKeepPhotoPlaceholder: {
    flex: 1,
    backgroundColor: '#2B2B2B',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timeKeepPhotoText: {
    color: '#FFFFFFB3',
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 13,
  },
  timeKeepHint: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'RedHatDisplay-Regular',
    marginTop: 10,
    marginBottom: 8,
  },
});

export default TimeKeepWorkout;
