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
import ResearchBar from "./ResearchBar"

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

    const handleFileSelected = info => {
        setSelectedImage(info)
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
        const response = await fetch(`http://localhost:8080/api/v1/upload/uploadPhotoUser`, {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        console.log(data.secure_url, "DATA SECURE URL")
        if (data.api_key) {
            setCloudinaryImage(data)
            console.log(data.api_key)
        } else {
            console.log(data.message)
        }
        console.log(data)
    }

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
        console.log(annonce)
    }, [annonce])
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
            {/* <Pressable type="file" style={styles.uploadButton} onPress={handleChoosePhoto}>
                <Text htmlFor="file">Ajouter des photos</Text>
                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
                )}
            </Pressable> */}
            <View style={styles.uploadButton}>
                <input
                    id="file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={info => handleFileSelected(info)}
                />
                <label htmlFor="file" style={styles.labelUploadButton}>
                    <strong>Ajouter des photos</strong>
                </label>
            </View>
            <Pressable style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Valider</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
