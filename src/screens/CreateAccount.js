import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

import HeaderComponent from "../components/HeaderComponent"
import CreateAccountForm from "../components/CreateAccountForm"
import LoginComponent from "../components/LoginComponent"

const CreateAccount = () => {
    const navigation = useNavigation()
    const router = useRoute()
    const [id, setId] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setId(router.params?.id)
    }, [router.params])

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation}/>
            <CreateAccountForm/>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    SafeAreaView: {
        width: "100%",
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
})
export default CreateAccount