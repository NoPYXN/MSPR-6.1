import React from "react"
import { View, Text, Pressable, StyleSheet, Image } from "react-native"
import { FaEnvelope } from "react-icons/fa"

const HeaderComponent = ({ navigation }) => {
    const handleReload = () => {
        // window.history.pushState({}, "", "/")
        console.log(window, "window")
        if (window.location.pathname == "/") {
            window.history.pushState({}, "", "/")
            // navigation.navigate({ name: "HomeScreen" })
            window.location.reload()
        } else {
            navigation.navigate({ name: "HomeScreen" }) // Redirige vers la même page pour la recharger
        }
    }

    const directionLoginOrProfil = () => {
        if (localStorage.getItem("token")) {
            console.log("Test redirection")
            navigation.navigate({ name: "ProfilScreen" })
        } else {
            navigation.navigate({ name: "LoginScreen" })
        }
    }

    const directionLoginOrMessage = () => {
        if (localStorage.getItem("token")) {
            navigation.navigate({ name: "PrivateMessageScreen" })
        } else {
            navigation.navigate({ name: "LoginScreen" })
        }
    }

    return (
        <View style={styles.headerContainer}>
            <Pressable onPress={() => directionLoginOrMessage()}>
                <View>
                    <FaEnvelope style={styles.icon} />
                </View>
            </Pressable>
            <Pressable onPress={() => handleReload()}>
                <View>
                    <Image source={require("../assets/logo.png")} style={styles.logo} />
                </View>
            </Pressable>

            <Pressable onPress={() => directionLoginOrProfil()}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    {localStorage.getItem("image") ? (
                        <Image
                            source={{ uri: localStorage.getItem("image") }}
                            style={styles.iconImage}
                        />
                    ) : (
                        <Image source={require("../assets/profil.png")} style={styles.icon} />
                    )}
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
        // resizeMode: "contain",
        objectFit: "contain",
        borderRadius: "50%",
    },
    iconImage: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        // resizeMode: "contain",
        objectFit: "contain",
    },
    logo: {
        width: 50,
        height: 50,
        // resizeMode: "contain",
        objectFit: "contain",
    },
})

export default HeaderComponent
