import React, { useState, useEffect } from "react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    Linking,
    TextInput,
    Pressable,
} from "react-native"
import { useNavigation, useParams, useRoute } from "@react-navigation/native"
import axios from "axios"
import { BsCheck } from "react-icons/bs"
import { AiFillEdit } from "react-icons/ai"
import * as DocumentPicker from "expo-document-picker"

import HeaderComponent from "../components/HeaderComponent"
import ModifierProfil from "../components/ModifierProfil"

const ProfilScreen = () => {
    const [user, setUser] = useState({})
    const navigation = useNavigation()
    const route = useRoute()
    const [isVisible, setIsVisible] = useState(false)
    const [selected, setSelected] = useState()
    const [selectedImage, setSelectedImage] = useState()
    const [isChangeUploadFile, setIsChangeUploadFile] = useState(false)
    const [tabImages, setTabImages] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [newImage, setNewImage] = useState("")

    useEffect(() => {
        axios({
            method: "get",
            url: "http://localhost:8080/api/v1/users/" + localStorage.getItem("id"),
            headers: { Authorization: localStorage.getItem("token") },
        })
            .then(data => {
                setUser(data.data.content)
            })
            .catch(err => {
                console.log(err, "err")
                navigation.navigate({ name: "LoginScreen" })
            })
        //il ne repasse pas dedans je ne sais pas pourquoi
    }, [])

    const handleFileSelected = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync()
            if (!result.canceled && result.assets.length > 0) {
                const fileUri = result.assets[0].uri
                const metadata = await fetchMetadata(fileUri)
                if (metadata) {
                    const file = new File(
                        [await fetch(fileUri).then(r => r.blob())],
                        metadata.name,
                        { type: metadata.type },
                    )
                    setSelectedImage(file)
                }
            } else {
            }
        } catch (err) {
            console.log("Erreur lors de la sélection du fichier :", err)
        }
    }

    const fetchMetadata = async fileUri => {
        try {
            const response = await fetch(fileUri)
            const contentDisposition = response.headers.get("Content-Disposition")
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            const filenameMatch = filenameRegex.exec(contentDisposition)
            const defaultName = "Untitled"
            const name = filenameMatch ? filenameMatch[1].replace(/['"]/g, "") : defaultName
            const blob = await response.blob()
            return new File([blob], name, { type: blob.type })
        } catch (error) {
            return null
        }
    }

    useEffect(() => {
        setIsChangeUploadFile(true)
        if (isChangeUploadFile) {
            handleSubmit()
        }
    }, [selectedImage])

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append("file", selectedImage)
        formData.append("upload_preset", "ml_default")
        const response = await fetch(`http://localhost:8080/api/v1/upload/uploadPhotoUserProfil`, {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        console.log(data, "DATA")
        if (data.upload) {
            console.log({ Image: data.message.secure_url }, "FFF")
            await axios
                .put("http://localhost:8080/api/v1/users/" + localStorage.getItem("id"), {
                    Image: data.message.secure_url,
                })
                .then(data => console.log(data))
                .catch(err => {
                    console.log(err)
                })
            // console.log(data2, "data2")
        } else {
        }
    }

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <View style={isVisible ? styles.ViewGlobaleOpacity : styles.ViewGlobale}>
                <View style={{ display: "flex", alignItems: "center" }}>
                    <Image source={require("../assets/profil.png")} style={styles.icon} />
                    <Pressable onPress={() => handleFileSelected()}>
                        <Text style={styles.labelUploadButton}>Changer photo profil</Text>
                    </Pressable>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        marginLeft: "5%",
                        marginRight: "5%",
                    }}
                >
                    <View style={{ width: "80%" }}>
                        <Text>{user.Civilite}</Text>
                        <Text>{user.Nom}</Text>
                        <Text>{user.Prenom}</Text>
                        <Text>{user.Pseudo}</Text>
                        <Text>{user.Email}</Text>
                        <Text>{user.Ville}</Text>
                        {user.Botanniste ? (
                            <View>
                                <Text>Botanniste </Text>
                                <BsCheck color={green} />
                            </View>
                        ) : (
                            <Text></Text>
                        )}
                    </View>
                    <View>
                        <Pressable
                            onPress={() => {
                                setIsVisible(true)
                            }}
                        >
                            <AiFillEdit />
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={{ height: "5%" }}></View>
            <View>
                <Text>Liste des annonces</Text>
                <Text>Vous n'avez pas d'annonce</Text>
                {/* {
                    user.Annonces.Lenght == 0 ? (
                        <Text>Vous n'avez pas d'annonce</Text>
                    ) : (
                        <Text>Afficher les annonces </Text>
                    )
                    //user.Annonces.map((key))
                } */}
            </View>
            {isVisible ? (
                <ModifierProfil user={user} setUser={setUser} setIsVisible={setIsVisible} />
            ) : (
                <View></View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 50,
        height: 50,
        // resizeMode: "contain",
        objectFit: "contain",
    },
    SafeAreaView: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    inputField: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        textAlign: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 20,
        textAlign: "center",
    },
    bottomContainer: {
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    signupText: {
        marginTop: 20,
        color: "#5cb85c",
        textAlign: "center",
        textDecorationLine: "underline",
    },
    ViewGlobale: {
        margin: "5%",
    },
    ViewGlobaleOpacity: {
        margin: "5%",
        opacity: "0.2",
    },
})

export default ProfilScreen
