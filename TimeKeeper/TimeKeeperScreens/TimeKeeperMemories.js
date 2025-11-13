import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  Share,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../TimeKeeperStore/timeKeeperContext';
import TimeKeepLayout from '../TimeKeeperComponents/TimeKeepLayout';
import { useNavigation } from '@react-navigation/native';

const timeKeepSTORAGE_MEMORIES = 'timekeep_workout_memories';
const { height } = Dimensions.get('window');

const TimeKeeperMemories = () => {
  const { setTimeKeepWorkoutMemories } = useStore();
  const [localMemories, setLocalMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await AsyncStorage.getItem(timeKeepSTORAGE_MEMORIES);
      if (data) {
        const parsed = JSON.parse(data);
        setLocalMemories(parsed);
        setTimeKeepWorkoutMemories(parsed);
      }
    } catch (e) {
      console.log('Load memories error', e);
    }
  };

  const saveMemories = async arr => {
    setLocalMemories(arr);
    setTimeKeepWorkoutMemories(arr);
    await AsyncStorage.setItem(timeKeepSTORAGE_MEMORIES, JSON.stringify(arr));
  };

  const handleDelete = async () => {
    const updated = localMemories.filter(m => m.id !== selectedMemory.id);
    await saveMemories(updated);
    setDeleteModalVisible(false);
    setSelectedMemory(null);
  };

  const handleShareTimeKeepMemory = async memory => {
    try {
      const message = memory.emotion || 'My training memory';

      await Share.share({ message });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  return (
    <TimeKeepLayout>
      <View
        showsVerticalScrollIndicator={false}
        style={styles.timeKeepContainer}
      >
        <View style={{ marginBottom: 30 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../../assets/images/timekeepback.png')} />
            <Text style={styles.timeKeepHeader}>Training memories</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 26 }}>
          {localMemories.length === 0 ? (
            <Text style={styles.emptyText}>
              You don’t have any training memories saved yet.
            </Text>
          ) : (
            localMemories.map(mem => (
              <View key={mem.id} style={styles.card}>
                {mem.photo ? (
                  <LinearGradient
                    colors={['#0089C8', '#2B2B2B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.timekeepphotoGradient}
                  >
                    <View style={{ padding: 1 }}>
                      <Image source={{ uri: mem.photo }} style={styles.photo} />
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.placeholderText}>No photo</Text>
                  </View>
                )}

                <Text style={styles.emotionText}>{mem.emotion}</Text>

                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    onPress={() => handleShareTimeKeepMemory(mem)}
                  >
                    <LinearGradient
                      colors={['#002640', '#FFFFFF36']}
                      style={[styles.btnGradBorder, { width: 127 }]}
                    >
                      <View style={styles.btnBorders}>
                        <View
                          style={[
                            styles.btnWrapper,
                            { backgroundColor: '#135CAA' },
                          ]}
                        >
                          <Text style={styles.btnText}>SHARE</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedMemory(mem);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <LinearGradient
                      colors={['#002640', '#FFFFFF36']}
                      style={[styles.btnGradBorder, { width: 127 }]}
                    >
                      <View style={styles.btnBorders}>
                        <View
                          style={[
                            styles.btnWrapper,
                            { backgroundColor: '#B02426' },
                          ]}
                        >
                          <Text style={styles.btnText}>DELETE</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <Modal visible={deleteModalVisible} transparent animationType="fade">
        {Platform.OS === 'ios' && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={3}
          />
        )}
        <View style={styles.overlay}>
          <View style={styles.deleteBox}>
            <Text style={styles.deleteText}>Delete memories?</Text>
            <View style={styles.deleteRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeleteModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delBtn}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.delText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TimeKeepLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    padding: 25,
    marginBottom: 20,
    paddingBottom: 50,
  },
  timekeepphotoGradient: {
    borderRadius: 10,
    width: '60%',
    alignSelf: 'center',
    marginBottom: 30,
    height: 160,
  },
  photo: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 20,
  },
  photoPlaceholder: {
    width: '60%',
    height: 160,
    backgroundColor: '#2B2B2B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  timeKeepHeader: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 22,
  },
  timeKeepContainer: {
    paddingTop: height * 0.1,
    paddingHorizontal: 16,
  },
  placeholderText: {
    color: '#FFFFFF70',
    fontFamily: 'RedHatDisplay-Regular',
  },
  emotionText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'RedHatDisplay-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  btnGradBorder: { borderRadius: 11 },
  btnBorders: { padding: Platform.OS === 'ios' ? 1 : 0 },
  btnWrapper: {
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#002640b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    width: '70%',
    padding: 26,
  },
  deleteText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'RedHatDisplay-SemiBold',
    marginBottom: 30,
  },
  deleteRow: {
    flexDirection: 'row',
    gap: 20,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  cancelText: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
  },
  delBtn: {
    backgroundColor: '#B02426',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  delText: {
    color: '#fff',
    fontFamily: 'RedHatDisplay-SemiBold',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 14,
    marginTop: 20,
  },
});

export default TimeKeeperMemories;
