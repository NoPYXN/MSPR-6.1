import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { AiOutlineClose } from "react-icons/ai"
import { useLoadScript } from "@react-google-maps/api"

import HeaderComponent from "../components/HeaderComponent"
import AddPlantForm from "../components/AddPlantForm"
import axios from "axios"

const FormulaireAnnonceScreen = () => {
    const navigation = useNavigation()
    const router = useRoute()
    const [id, setId] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log("dans le useEffect")
        setIsLoading(true)
        setId(router.params?.id)
        axios({
            method: "get",
            url: "http://localhost:8080/api/v1/users/" + localStorage.getItem("id"),
            headers: { Authorization: localStorage.getItem("token") },
        })
            .then(data => {
                // if (!data.content) {
                //     console.log("dans le if")
                // navigation.navigate({ name: "LoginScreen" })
                // }
                console.log(data)
                // setUser(data.data.content)
            })
            .catch(err => {
                console.log(err, "err")
                navigation.navigate({ name: "LoginScreen" })
            })
        //il ne repasse pas dedans je ne sais pas pourquoi
    }, [router.params])

    const goRetour = () => {
        if (id) {
            navigation.navigate({
                name: "ProfilScreen",
            })
        } else {
            navigation.navigate({
                name: "HomeScreen",
            })
        }
    }

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <View style={styles.ViewGoBack}>
                <Pressable onPress={() => goRetour()}>
                    <AiOutlineClose />
                </Pressable>
            </View>
            {id ? (
                <Text style={styles.TextTitre}>Modifier une annonce</Text>
            ) : (
                <Text style={styles.TextTitre}>Ajouter une annonce</Text>
            )}

            {isLoading == true ? (
                <AddPlantForm navigation={navigation} router={router} id={id} />
            ) : (
                <View></View>
            )}
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
export default FormulaireAnnonceScreen
