import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test Sayfası - Uygulama Çalışıyor! 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});
