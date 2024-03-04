import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import ResearchBar from "./ResearchBar"
import * as Permissions from "expo-permissions"
import * as DocumentPicker from "expo-document-picker"
import { BsTrash } from "react-icons/bs"
import axios from "axios"

const AddPlantForm = ({ navigation }) => {
    const [imageUri, setImageUri] = useState(null)
    const [isAddPlantFrom, setIsAddPlantFrom] = useState(true)
    const [searchVille, setSearchVille] = useState()
    const [coordonnees, setCoordonnees] = useState()
    const [selected, setSelected] = useState()
    const [annonce, setAnnonce] = useState({})
    const [selectedImage, setSelectedImage] = useState()
    const [isChangeUploadFile, setIsChangeUploadFile] = useState(false)
    const [tabImages, setTabImages] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)

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
        const response = await fetch(`http://localhost:8080/api/v1/upload/uploadPhotoUser`, {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        console.log(data, "DATA")
        if (data.upload) {
            setTabImages([
                ...tabImages,
                {
                    api_key: data.message.public_id.split("Arosaje/annonces/")[1],
                    secure_url: data.message.secure_url,
                },
            ])
        } else {
            console.log("")
        }
    }

    const deleteImage = async id => {
        const response = await fetch(`http://localhost:8080/api/v1/upload/upload/` + id, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
        })
        const data = await response.json()
        if (data.delete) {
            setTabImages(tabImages.filter(element => element.api_key !== id))
        }
    }

    const ajouterAnnonce = async () => {
        let tab = []
        tabImages.forEach(element => {
            tab.push(element.secure_url)
        })
        await axios
            .post(`http://localhost:8080/api/v1/annonces`, { ...annonce, Id_Plante: tab })
            .then(data => {
                if (data.status == 201) {
                    navigation.replace("HomeScreen", { popup: "Votre annonce a bien été ajoutée" })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Nom de la plante</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setAnnonce({ ...annonce, Titre: text })}
                placeholder="Entrez le nom de la plante"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setAnnonce({ ...annonce, Description: text })}
                placeholder="Entrez une description"
                multiline
            />
            <Text style={styles.label}>Date de début de gardiennage</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setAnnonce({ ...annonce, DateDebut: text })}
                placeholder="Sélectionnez une date"
            />
            <Text style={styles.label}>Date de fin de gardiennage</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setAnnonce({ ...annonce, DateFin: text })}
                placeholder="Sélectionnez une date"
            />
            <Text style={styles.label}>Ville</Text>
            <ResearchBar
                isAddPlantFrom={isAddPlantFrom}
                selected={selected}
                setSelected={setSelected}
                searchVille={searchVille}
                setSearchVille={setSearchVille}
                setCoordonnees={setCoordonnees}
                annonces={annonce}
                setAnnonces={setAnnonce}
            />

            <Text style={styles.label}>Télécharger des images</Text>
            <View style={styles.uploadButton}>
                <TouchableOpacity onPress={handleFileSelected}>
                    <Text style={styles.labelUploadButton}>Sélectionner un fichier</Text>
                </TouchableOpacity>
                {selectedFile && <Text>Fichier sélectionné : {selectedFile.name}</Text>}
            </View>
            <View style={styles.viewTabImage}>
                {tabImages
                    ? tabImages?.map((image, index) => (
                          <View key={index} style={styles.viewImageMap}>
                              <TouchableOpacity
                                  onPress={() => {
                                      deleteImage(image.api_key)
                                  }}
                                  style={styles.croix}
                              >
                                  <BsTrash size={15} />
                              </TouchableOpacity>
                              <Image source={{ uri: image.secure_url }} style={styles.imagetab} />
                          </View>
                      ))
                    : ""}
            </View>
            <Pressable
                onPress={() => {
                    ajouterAnnonce()
                }}
                style={styles.submitButton}
            >
                <Text style={styles.submitButtonText}>Valider</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    viewImageMap: {
        marginLeft: "2%",
        marginRight: "2%",
        marginBottom: "2%",
        position: "relative",
    },
    imagetab: {
        height: 100,
        width: 100,
    },

    croix: {
        position: "absolute",
        top: 2,
        right: 2,
        zIndex: 1,
    },

    container: {
        flex: 1,
    },

    viewTabImage: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "5%",
    },
    formContainer: {
        padding: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 15,
    },
    label: {
        marginBottom: 5,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        borderStyle: "dashed",
        padding: 20,
        marginBottom: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: "green",
        borderRadius: 10,
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },

    labelUploadButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
    },
})

export default AddPlantForm
