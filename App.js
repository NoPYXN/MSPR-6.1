import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './src/components/header';

const App = () => {
  return (
    <View style={styles.container}>
      <Header 
        onMenuPress={() => console.log('Menu Pressed')}
        onProfilePress={() => console.log('Profile Pressed')}
      />
      {/* Autres composants ou vues */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Vous pouvez ajouter d'autres styles pour le conteneur si nécessaire
  },
});

export default App;
