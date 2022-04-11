import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => (
  <View style={styles.container}>
    <MainNavigator />
  </View>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
