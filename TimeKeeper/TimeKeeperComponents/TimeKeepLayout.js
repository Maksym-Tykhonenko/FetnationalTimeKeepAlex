import { ScrollView, StyleSheet, View } from 'react-native';

const TimeKeepLayout = ({ children }) => {
  return (
    <View style={styles.timekeepwelcomecn}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  timekeepwelcomecn: {
    flex: 1,
    backgroundColor: '#002640',
  },
});

export default TimeKeepLayout;
