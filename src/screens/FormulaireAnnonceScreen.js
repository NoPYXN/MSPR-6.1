import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { AiOutlineClose } from "react-icons/ai"
import { useLoadScript } from "@react-google-maps/api"

import HeaderComponent from "../components/HeaderComponent"
import AddPlantForm from "../components/AddPlantForm"

const FormulaireAnnonceScreen = () => {
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
            <HeaderComponent navigation={navigation} />
            <View style={styles.ViewGoBack}>
                <Pressable
                    onPress={() =>
                        navigation.navigate({
                            name: "HomeScreen",
                            params: { isActions: "true" },
                        })
                    }
                >
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
