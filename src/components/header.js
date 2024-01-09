import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LogoArosaje from "./assets/logo"

const Header = ({ onMenuPress, onProfilePress }) => {
    return (
        <View style={styles.headerContainer}>
            {/* Menu Hamburger */}
            <TouchableOpacity onPress={onMenuPress}>
                <Image
                    src={LogoArosaje} // Remplacez par votre icône de menu
                    style={styles.icon}
                />
            </TouchableOpacity>

            {/* Logo */}
            <Image
                src={LogoArosaje} // Remplacez par votre logo
                style={styles.logo}
            />

            {/* Bouton Profil */}
            <TouchableOpacity onPress={onProfilePress}>
                <Image
                    src={LogoArosaje} // Remplacez par votre icône de profil
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff', // Modifiez selon votre thème
    },
    icon: {
        width: 25,
        height: 25,
    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
});

export default Header;