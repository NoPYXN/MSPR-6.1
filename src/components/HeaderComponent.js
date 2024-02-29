import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"

const HeaderComponent = ({ navigation }) => {
    const handleReload = () => {
        navigation.replace("HomeScreen") // Redirige vers la même page pour la recharger
    }

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => console.log("Menu clicked")}>
                <View>
                    <Image source={require("../assets/menu.png")} style={styles.icon} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReload()}>
                <View>
                    <Image source={require("../assets/logo.png")} style={styles.logo} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("Profil clicked")}>
                <View>
                    <Image source={require("../assets/profil.png")} style={styles.icon} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
        backgroundColor: "green",
    },
    icon: {
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
})

export default HeaderComponent
