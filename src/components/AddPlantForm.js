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
// import * as ImagePicker from "react-native-image-picker"
import * as ImagePicker from "expo-image-picker"
import ResearchBar from "./ResearchBar"
// import * as DocumentPicker from "react-native-document-picker"
import * as Permissions from "expo-permissions" // Importez Permissions depuis Expo
import * as DocumentPicker from "expo-document-picker"

const AddPlantForm = () => {
    const [imageUri, setImageUri] = useState(null)
    const [isAddPlantFrom, setIsAddPlantFrom] = useState(true)
    const [searchVille, setSearchVille] = useState()
    const [coordonnees, setCoordonnees] = useState()
    const [selected, setSelected] = useState()
    const [annonce, setAnnonce] = useState({})
    const [selectedImage, setSelectedImage] = useState()
    const [isChangeUploadFile, setIsChangeUploadFile] = useState(false)
    const [cloudinaryImage, setCloudinaryImage] = useState()

    const [tabImages, setTabImages] = useState([
        {
            api_key: "kkk",
            secure_url:
                "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif",
        },
        {
            api_key: "kkk",
            secure_url:
                "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif",
        },
        {
            api_key: "kkk",
            secure_url:
                "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif",
        },
    ])

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
                    console.log("Fichier sélectionné:", file)
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
        console.log(selectedImage, "file")
        const formData = new FormData()
        formData.append("file", selectedImage)
        formData.append("upload_preset", "ml_default")
        console.log(formData, "formData")
        const response = await fetch(`http://localhost:8080/api/v1/upload/uploadPhotoUser`, {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        // console.log(data.secure_url, "DATA SECURE URL")
        console.log(data, "DATA")
        if (data.upload) {
            setCloudinaryImage(data)
            // console.log(data, "DATA")
            setTabImages([
                ...tabImages,
                {
                    api_key: data.message.public_id.split("Arosaje/annonces/")[1],
                    secure_url: data.message.secure_url,
                },
            ])
            // console.log(data.api_key)
        } else {
            // console.log(data.message)
        }
        // console.log(data)
    }

    useEffect(() => {
        console.log(tabImages)
    }, [tabImages])

    const deleteImage = async () => {
        console.log(cloudinaryImage, "cloudinary image")
        const response = await fetch(
            `http://localhost:8080/api/v1/upload/upload/` + "nt7p5oeuuyuigrynxhfs",
            {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                },
            },
        )
        const data = await response.json()
        if (data.message) {
            setCloudinaryImage("")
        }
    }

    useEffect(() => {
        console.log(cloudinaryImage, "cloudinaryimage")
    }, [cloudinaryImage])

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
                    ? tabImages.map((image, index) => (
                          <View style={styles.viewImageMap}>
                              <View className={styles.buttonCroix}>
                                  <TouchableOpacity
                                      onPress={() => {
                                          deleteImage(image.api_key)
                                      }}
                                      style={styles.croix}
                                  >
                                      <Text>X</Text>
                                      {/* <AiOutlineClose size={20} /> */}
                                  </TouchableOpacity>
                              </View>
                              <Image
                                  key={index}
                                  source={{ uri: image.secure_url }}
                                  style={styles.imagetab}
                              />
                          </View>
                      ))
                    : ""}
            </View>
            <Pressable style={styles.submitButton}>
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
    },
    imagetab: {
        height: 100,
        width: 100,
        position: "relative",
    },

    croix: {
        position: "absolute",
        right: 10,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
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
