import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Platform,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimeKeepLayout from '../TimeKeeperComponents/TimeKeepLayout';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import Orientation from 'react-native-orientation-locker';

const timeKeepSTORAGE_KEY = 'timekeep_stories';
const { height: timeKeepHeight } = Dimensions.get('window');

const TimeKeepAddStory = () => {
  const [timeKeepStories, setTimeKeepStories] = useState([]);
  const [timeKeepModalVisible, setTimeKeepModalVisible] = useState(false);
  const [timeKeepDeleteModalVisible, setTimeKeepDeleteModalVisible] =
    useState(false);
  const [timeKeepStoryToDelete, setTimeKeepStoryToDelete] = useState(null);
  const [timeKeepTitle, setTimeKeepTitle] = useState('');
  const [timeKeepText, setTimeKeepText] = useState('');
  const [timeKeepPhoto1, setTimeKeepPhoto1] = useState(null);
  const [timeKeepPhoto2, setTimeKeepPhoto2] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      Platform.OS === 'android' &&
        (timeKeepDeleteModalVisible || timeKeepModalVisible) &&
        Orientation.lockToPortrait();

      return () => Orientation.unlockAllOrientations();
    }, [timeKeepDeleteModalVisible, timeKeepModalVisible]),
  );

  useEffect(() => {
    timeKeepLoadStories();
  }, []);

  const timeKeepLoadStories = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(timeKeepSTORAGE_KEY);
      if (jsonValue) setTimeKeepStories(JSON.parse(jsonValue));
    } catch (e) {
      console.log('Load stories error', e);
    }
  };

  const timeKeepSaveStories = async updated => {
    try {
      setTimeKeepStories(updated);
      await AsyncStorage.setItem(timeKeepSTORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log('Save stories error', e);
    }
  };

  const timeKeepPickImage = async setFn => {
    const options = { mediaType: 'photo', quality: 0.8 };
    launchImageLibrary(options, response => {
      const uri = response?.assets?.[0]?.uri;
      if (uri) setFn(uri);
    });
  };

  const timeKeepAddStory = async () => {
    if (!timeKeepTitle.trim() || !timeKeepText.trim()) return;
    const newStory = {
      id: Date.now().toString(),
      title: timeKeepTitle,
      text: timeKeepText,
      photo1: timeKeepPhoto1,
      photo2: timeKeepPhoto2,
    };

    const updated = [newStory, ...timeKeepStories];
    await timeKeepSaveStories(updated);
    setTimeKeepModalVisible(false);
    setTimeKeepTitle('');
    setTimeKeepText('');
    setTimeKeepPhoto1('');
    setTimeKeepPhoto2('');
  };

  const timeKeepConfirmDelete = story => {
    setTimeKeepStoryToDelete(story);
    setTimeKeepDeleteModalVisible(true);
  };

  const timeKeepDeleteStory = async () => {
    const updated = timeKeepStories.filter(
      s => s.id !== timeKeepStoryToDelete.id,
    );
    await timeKeepSaveStories(updated);
    setTimeKeepDeleteModalVisible(false);
  };

  const handleShareTimeKeepStory = async story => {
    try {
      const message =
        `${story.title}
${story.text}` || 'My training story';

      await Share.share({ message });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  return (
    <TimeKeepLayout>
      <View style={styles.timeKeepContainer}>
        <View style={styles.timeKeepHeaderRow}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../../assets/images/timekeepback.png')} />
            <Text style={styles.timeKeepHeader}>Add Your Story</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTimeKeepModalVisible(true)}>
            <Text style={styles.timeKeepPlus}>＋</Text>
          </TouchableOpacity>
        </View>

        {timeKeepStories.length === 0 ? (
          <Text style={styles.timeKeepEmptyText}>
            You don’t have your stories yet.
          </Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {timeKeepStories.map(story => (
              <View key={story.id} style={styles.timeKeepStoryCard}>
                <Text style={styles.timeKeepStoryTitle}>{story.title}</Text>
                <Text style={styles.timeKeepStoryText}>{story.text}</Text>
                <View style={styles.timeKeepImageRow}>
                  {story.photo1 && (
                    <Image
                      source={{ uri: story.photo1 }}
                      style={styles.timeKeepStoryImage}
                    />
                  )}
                  {story.photo2 && (
                    <Image
                      source={{ uri: story.photo2 }}
                      style={styles.timeKeepStoryImage}
                    />
                  )}
                </View>
                <View style={styles.timeKeepStoryButtons}>
                  <TouchableOpacity
                    style={{ alignSelf: 'center', marginTop: 26 }}
                    activeOpacity={0.7}
                    onPress={() => handleShareTimeKeepStory(story)}
                  >
                    <LinearGradient
                      colors={['#002640', '#FFFFFF36']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.timeKeepBtnGradBorder}
                    >
                      <View style={[styles.timeKeepBtnBorders, { width: 127 }]}>
                        <View
                          style={[
                            styles.timeKeepBtnWrapper,
                            { backgroundColor: '#135CAA' },
                          ]}
                        >
                          <Text style={styles.timeKeepBtnText}>SHARE</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ alignSelf: 'center', marginTop: 26 }}
                    activeOpacity={0.7}
                    onPress={() => timeKeepConfirmDelete(story)}
                  >
                    <LinearGradient
                      colors={['#002640', '#FFFFFF36']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.timeKeepBtnGradBorder}
                    >
                      <View style={[styles.timeKeepBtnBorders, { width: 127 }]}>
                        <View
                          style={[
                            styles.timeKeepBtnWrapper,
                            { backgroundColor: '#B12426' },
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
        )}

        <Modal
          visible={timeKeepModalVisible}
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
            <View style={styles.timeKeepModalBox}>
              <Text style={styles.timeKeepModalTitle}>Add your story</Text>
              <TextInput
                placeholder="Story title"
                placeholderTextColor="#FFFFFF7D"
                value={timeKeepTitle}
                onChangeText={setTimeKeepTitle}
                style={styles.timeKeepInput}
                maxLength={20}
              />
              <TextInput
                placeholder="Tell something interesting"
                placeholderTextColor="#FFFFFF7D"
                value={timeKeepText}
                onChangeText={setTimeKeepText}
                multiline
                style={styles.timeKeepTextarea}
                maxLength={70}
              />
              <View style={styles.timeKeepImagePickRow}>
                {[timeKeepPhoto1, timeKeepPhoto2].map((photo, i) => (
                  <LinearGradient
                    key={i}
                    colors={['#0089C8', '#2B2B2B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.timeKeepPhotoGradient}
                  >
                    <View style={{ padding: 1 }}>
                      {photo ? (
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() =>
                            timeKeepPickImage(
                              i === 0 ? setTimeKeepPhoto1 : setTimeKeepPhoto2,
                            )
                          }
                        >
                          <Image
                            source={{ uri: photo }}
                            style={styles.timeKeepPhoto}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.timeKeepWelcomeCn}>
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() =>
                              timeKeepPickImage(
                                i === 0 ? setTimeKeepPhoto1 : setTimeKeepPhoto2,
                              )
                            }
                          >
                            <Image
                              source={require('../../assets/images/timekeeppicker.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                ))}
              </View>

              {timeKeepText &&
                timeKeepTitle &&
                (timeKeepPhoto1 || timeKeepPhoto2) && (
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      marginTop: 26,
                      width: '100%',
                    }}
                    activeOpacity={0.7}
                    onPress={timeKeepAddStory}
                  >
                    <LinearGradient
                      colors={['#002640', '#FFFFFF36']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.timeKeepBtnGradBorder}
                    >
                      <View style={styles.timeKeepBtnBorders}>
                        <View
                          style={[styles.timeKeepBtnWrapper, { height: 73 }]}
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
          </View>
        </Modal>

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
              <Text style={styles.timeKeepDeleteText}>Delete story?</Text>
              <View style={styles.timeKeepDeleteRow}>
                <TouchableOpacity
                  style={styles.timeKeepCancelBtn}
                  onPress={() => setTimeKeepDeleteModalVisible(false)}
                >
                  <Text style={styles.timeKeepCancelText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeKeepDelBtn}
                  onPress={timeKeepDeleteStory}
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
  timeKeepPhotoGradient: {
    borderRadius: 10,
  },
  timeKeepPhoto: {
    width: 130,
    height: 120,
    borderRadius: 10,
  },
  timeKeepWelcomeCn: {
    width: '100%',
    padding: 30,
    height: 120,
    backgroundColor: '#2B2B2B',
    borderRadius: 10,
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
  timeKeepStoryCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 23,
    paddingVertical: 33,
    marginBottom: 20,
  },
  timeKeepStoryTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'RedHatDisplay-SemiBold',
    marginBottom: 23,
  },
  timeKeepStoryText: {
    color: '#ccc',
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 15,
    marginBottom: 30,
  },
  timeKeepImageRow: {
    flexDirection: 'row',
    marginBottom: 50,
    justifyContent: 'space-between',
  },
  timeKeepStoryImage: {
    width: '46%',
    height: 140,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#0089C8',
  },
  timeKeepStoryButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
    flexWrap: 'wrap',
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
    backgroundColor: '#135CAA',
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
    width: '85%',
    borderRadius: 20,
    padding: 40,
    paddingHorizontal: 30,
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
  timeKeepTextarea: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    padding: 15,
    height: 100,
    marginBottom: 21,
    textAlignVertical: 'top',
  },
  timeKeepImagePickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
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

export default TimeKeepAddStory;
