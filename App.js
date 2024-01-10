import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './src/components/header';

const App = () => {
  return (
    <View style={styles.container}>
      <Header 
        onMenuPress={() => console.log('Menu Pressed')}
        onProfilePress={() => console.log('Profile Pressed')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
