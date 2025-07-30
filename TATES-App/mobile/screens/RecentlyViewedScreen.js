import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function RecentlyViewedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recently Viewed Screen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#222f3e' },
});
