import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './src/components/header.js'; // Assurez-vous d'importer correctement

const SomeScreen = () => {
    return (
        <View style={styles.screen}>
            <Header
                onMenuPress={() => console.log('Menu Pressed')}
                onProfilePress={() => console.log('Profile Pressed')}
            />
            {/* Reste de votre écran */}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // Autres styles pour votre écran
    },
});

export default SomeScreen;
