import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => console.log('Menu clicked')}>
        {/* Icône du menu, remplacer 'menu-icon.png' par votre image locale ou utiliser une icône de bibliothèque */}
        <Image source={require('../assets/menu.png')} style={styles.icon} resizeMode='contain'/>
      </Pressable>
      <Pressable onPress={() => console.log('Logo clicked')}>
        {/* Logo, remplacer 'logo.png' par votre image locale */}
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode='contain'/>
      </Pressable>
      <Pressable onPress={() => console.log('Pofil clicked')}>
        <Image source={require('../assets/profil.png')} style={styles.icon} resizeMode='contain' />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // Assurez-vous que le conteneur s'étend sur toute la largeur
        paddingHorizontal: 10, // Padding horizontal pour ne pas coller sur les bords de l'écran
        backgroundColor: 'green', // Couleur de fond de l'en-tête
      },
      icon: {
        width: 25,
        height: 25,
      },
      logo: {
        width: 50,
        height: 50,
      },
});

export default Header;
