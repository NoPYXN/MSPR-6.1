import React from "react"
import { View, Text, Pressable, StyleSheet, Image } from "react-native"

const HeaderComponent = ({ navigation }) => {
    const handleReload = () => {
        window.history.pushState({}, "", "/")
        navigation.replace("HomeScreen") // Redirige vers la même page pour la recharger
    }

    return (
        <View style={styles.headerContainer}>
            <Pressable onPress={() => console.log("Menu clicked")}>
                <View>
                    <Image source={require("../assets/menu.png")} style={styles.icon} />
                </View>
            </Pressable>
            <Pressable onPress={() => handleReload()}>
                <View>
                    <Image source={require("../assets/logo.png")} style={styles.logo} />
                </View>
            </Pressable>
            <Pressable onPress={() => console.log("Profil clicked")}>
                <View>
                    <Image source={require("../assets/profil.png")} style={styles.icon} />
                </View>
            </Pressable>
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
