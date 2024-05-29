import React, { useState, useEffect } from "react"
import { View, Image, Text, StyleSheet, Pressable } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { FontAwesome5 } from "@expo/vector-icons"
import * as DocumentPicker from "expo-document-picker"
import axios from "axios"

import Galerie from "./GalerieComponent"

const PhotoPicker = ({ onImageSelect, selectedImages, setSelectedImages, id, annonceUserGard }) => {
    const [selectedImage, setSelectedImage] = useState()
    const [isChangeUploadFile, setIsChangeUploadFile] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (annonceUserGard == localStorage.getItem("id")) {
            setIsVisible(true)
        }
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.canceled) {
            // setSelectedImages([...selectedImages, result.uri])
        }
    }

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
                console.log("Sélection de fichier annulée ou aucun fichier sélectionné")
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
            console.error("Erreur lors de la récupération des métadonnées du fichier:", error)
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
        const response = await fetch(`http://localhost:8080/api/v1/upload/uploadPhotoEtat`, {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        console.log(data, "DATA")
        if (data.upload) {
            setSelectedImages([...selectedImages, data.message.secure_url])

            await axios({
                method: "put",
                url: `http://localhost:8080/api/v1/annonces/${id}`,
                headers: { Authorization: localStorage.getItem("token") },
                data: {
                    EtatPlantes: [...selectedImages, data.message.secure_url],
                },
            })
                .then(data => {
                    console.log("resultat", data)
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            console.log("")
        }
    }

    return (
        <View style={styles.container}>
            {isVisible ? (
                <Pressable style={styles.button} onPress={() => handleFileSelected()}>
                    <FontAwesome5 name="upload" size={25} color="black" />
                    {/* size={50} */}
                    {/* <Text style={styles.text}>Ajouter des photos</Text> */}
                </Pressable>
            ) : (
                <View></View>
            )}

            {selectedImages.length > 0 ? (
                <Galerie images={selectedImages} />
            ) : (
                <View>
                    <Text
                        style={
                            isVisible
                                ? { fontStyle: "italic" }
                                : { fontStyle: "italic", marginTop: "10%" }
                        }
                    >
                        Aucunes photos
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "5%",
    },
    button: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        // width: 150,
        // height: 100,
        width: 50,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
    },
    text: {
        // marginTop: 10,
        // fontSize: 16,
    },
})

export default PhotoPicker
