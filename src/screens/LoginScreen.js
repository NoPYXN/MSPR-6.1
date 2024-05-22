import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

import HeaderComponent from "../components/HeaderComponent"
import LoginComponent from "../components/LoginComponent"

const LoginScreen = () => {
    const navigation = useNavigation()
    const router = useRoute()
    const [id, setId] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isDelete, setIsDelete] = useState()
    const [showFirstView, setShowFirstView] = useState(true)
    const [message, setMessage] = useState(router.params?.popup || "")

    useEffect(() => {
        setIsLoading(true)
        setId(router.params?.id)
        console.log(router, "router")
        if (router.params?.popup) {
            setIsDelete(true)
            delete router.params.popup

            navigation.navigate({
                name: "LoginScreen",
            })
            const timer = setTimeout(() => {
                setShowFirstView(false)
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, []) //router.params

    useEffect(() => {
        if (!showFirstView) {
            setIsDelete(false)
            setShowFirstView(true)
        }
    }, [showFirstView])

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            {isDelete && showFirstView ? (
                <View style={styles.ViewMessage}>
                    <Text style={styles.textMessage}>{message}</Text>
                </View>
            ) : (
                <View></View>
            )}
            <View
                style={{ display: "flex", justifyContent: "center", width: "100%", height: "50%" }}
            >
                <LoginComponent />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    SafeAreaView: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
    },
    ViewGoBack: {
        padding: 20,
        display: "flex",
        alignItems: "flex-end",
    },
    TextTitre: {
        textAlign: "center",
        fontSize: "20px;",
    },
    ViewMessage: {
        width: "100%",
        height: "30px",
        backgroundColor: "black",
    },
    textMessage: {
        color: "green",
        textAlign: "center",
        marginTop: "auto",
        marginBottom: "auto",
    },
})
export default LoginScreen
