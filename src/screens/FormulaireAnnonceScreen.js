import React, { useState, useEffect } from "react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    Linking,
    TextInput,
    Touchable,
    Pressable,
} from "react-native"
import axios from "axios"
import { useNavigation, useParams, useRoute } from "@react-navigation/native"
import { AiOutlineClose } from "react-icons/ai"

import HeaderComponent from "../components/HeaderComponent"
import AddPlantForm from "../components/AddPlantForm"

const FormulaireAnnonceScreen = () => {
    const navigation = useNavigation()
    const router = useRoute()
    const [id, setId] = useState(router.params?.id)
    const [isCreate, setIsCreate] = useState(false)
    const [isLoading, setIsLoading] = useState(!router.params?.id)

    const [annonce, setAnnonce] = useState({})

    useEffect(() => {
        if (router.params?.id) {
            setIsLoading(true)
            axios
                .get(`http://localhost:8080/api/v1/annonces/${router.params.id}`)
                .then(data => {
                    if (data.status == 200) {
                        data.data.content.DateDebut = convertirDate(data.data.content.DateDebut)
                        data.data.content.DateFin = convertirDate(data.data.content.DateFin)
                        setAnnonce(data.data.content)
                        setId(router.params.id)
                        setIsLoading(false)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            setIsCreate(true)
        }
    }, [router.params])

    const convertirDate = dateString => {
        const date = new Date(dateString)

        const jour = ("0" + date.getDate()).slice(-2)
        const mois = ("0" + (date.getMonth() + 1)).slice(-2)
        const annee = date.getFullYear()

        const dateFormatee = `${jour}/${mois}/${annee}`

        return dateFormatee
    }

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
                <Text style={styles.TextTitre}>
                    Modifier une annonce-----{id ? id : "XXXXXXXXXXXX"}
                </Text>
            ) : (
                <Text style={styles.TextTitre}>
                    Ajouter une annonce----- {id ? id : "XXXXXXXXXXXX"}
                </Text>
            )}

            {isLoading ? (
                <AddPlantForm
                    navigation={navigation}
                    router={router}
                    annonce={annonce}
                    setAnnonce={setAnnonce}
                />
            ) : (
                <AddPlantForm
                    navigation={navigation}
                    id={id}
                    router={router}
                    annonce={annonce}
                    setAnnonce={setAnnonce}
                />
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
