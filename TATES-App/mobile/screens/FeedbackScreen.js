import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function FeedbackScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feedback Screen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#222f3e' },
});
