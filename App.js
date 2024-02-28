import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './src/components/header';
import CreateAccountForm from './src/components/CreateAccountForm';

const App = () => {
  return (
    <View style={styles.container}>
      <Header 
      />
      <CreateAccountForm />
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
