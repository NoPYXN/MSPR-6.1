import React, { useState, useEffect } from "react"
import { View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView } from "react-native"
import * as ImagePicker from "expo-image-picker"
import ResearchBar from "./ResearchBar"
import * as Permissions from "expo-permissions"
import * as DocumentPicker from "expo-document-picker"
import { BsTrash } from "react-icons/bs"
import axios from "axios"
import { useRoute } from "@react-navigation/native"
import UploadImage from "./UploadImage"
// import * as ImagePicker from "react-native-image-picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { AiTwotoneCalendar } from "react-icons/ai"
import { convertirDateCalendrier } from "../utils/ConvertirDateCalendrier"

let DatePicker
// if (Platform.OS === "web") {
DatePicker = require("react-datepicker").default
require("react-datepicker/dist/react-datepicker.css")
// }

const AddPlantForm = ({ navigation, id, annonce, setAnnonce, router }) => {
    // const [imageUri, setImageUri] = useState(null)
    const [isAddPlantFrom, setIsAddPlantFrom] = useState(true)
    const [searchVille, setSearchVille] = useState()
    const [coordonnees, setCoordonnees] = useState()
    const [selected, setSelected] = useState()
    // const [annonce2, setAnnonce2] = useState({})
    const [selectedImage, setSelectedImage] = useState()
    const [isChangeUploadFile, setIsChangeUploadFile] = useState(false)
    const [tabImages, setTabImages] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    // const [imageUri, setImageUri] = useState(null);
    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    // const [idd, setIdd] = useState(router.params?.id || undefined)

    // const handleChoosePhoto = () => {
    //     const options = {
    //         noData: true,
    //     }
    //     ImagePicker.launchImageLibrary(options, response => {
    //         if (response.uri) {
    //             setImageUri(response.uri)
    //         }
    //     })
    // }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShow(Platform.OS === "ios") // Only relevant for iOS, to keep the picker open
        setDate(currentDate)
    }

    useEffect(() => {
        console.log(date, "DATE")
        let x = convertirDateCalendrier(date)
        console.log(x, "X")
    }, [date])

    // const showDatepicker = () => {
    //     setShow(true)
    // }

    useEffect(() => {
        console.log(id, "IDDDDD")
        console.log(annonce, "ANNONCE")
        if (id) {
            let tab = []
            annonce.Id_Plante.forEach(element => {
                tab.push({
                    secure_url: element,
                    api_key: element.split("/Arosaje/annonces/")[1].split(".")[0],
                })
            })
            setTabImages(tab)
        }
    }, [router.params])

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
                // console.log("Sélection de fichier annulée ou aucun fichier sélectionné")
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
        // console.log(data, "DATA")
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
    /////////

    const ajouterAnnonce = async () => {
        // console.log(annonce, "annonce")
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

    const modifierAnnonce = async () => {
        let tab = []
        tabImages.forEach(element => {
            tab.push(element.secure_url)
        })
        await axios
            .put(`http://localhost:8080/api/v1/annonces/${id}`, { ...annonce, Id_Plante: tab })
            .then(data => {
                if (data.status == 200) {
                    navigation.replace("HomeScreen", { popup: "Votre annonce a bien été modifiée" })
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
                value={annonce?.Titre || ""}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setAnnonce({ ...annonce, Description: text })}
                placeholder="Entrez une description"
                multiline
                value={annonce?.Description || ""}
            />
            <Text style={styles.label}>Date de début de gardiennage</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setAnnonce({ ...annonce, DateDebut: text })}
                placeholder="Sélectionnez une date"
                value={annonce?.DateDebut || ""}
            />
            <Text style={styles.label}>Date de fin de gardiennage</Text>
            <View style={styles.containerDate}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setAnnonce({ ...annonce, DateFin: text })}
                    placeholder="Sélectionnez une date"
                    value={annonce?.DateFin || ""}
                />
                <Pressable
                    onPress={() => {
                        show ? setShow(false) : setShow(true)
                    }}
                >
                    <View style={styles.sendButton}>
                        <AiTwotoneCalendar style={styles.sendButtonContent} size={30} />
                    </View>
                </Pressable>
            </View>

            {/* {show && Platform.OS !== "web" && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onChange} />
            )} */}
            {/* {show && Platform.OS === "web" && DatePicker && (
                <DatePicker selected={date} onChange={newDate => setDate(newDate)} inline />
            )} */}
            {show && DatePicker && (
                <DatePicker selected={date} onChange={newDate => setDate(newDate)} inline />
            )}
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
                valueVille={annonce?.Ville || ""}
            />

            <Text style={styles.label}>Télécharger des images</Text>
            {/* <UploadImage
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setIsChangeUploadFile={setIsChangeUploadFile}
                isChangeUploadFile={isChangeUploadFile}
                selectedFile={selectedFile}
                tabImages={tabImages}
                setTabImages={setTabImages}
            /> */}
            <View style={styles.uploadButton}>
                <Pressable onPress={handleFileSelected}>
                    <Text style={styles.labelUploadButton}>Sélectionner un fichier</Text>
                </Pressable>
                {selectedFile && <Text>Fichier sélectionné : {selectedFile.name}</Text>}
            </View>

            <View style={styles.viewTabImage}>
                {tabImages
                    ? tabImages.map((image, index) => (
                          <View key={index} style={styles.viewImageMap}>
                              <Pressable
                                  onPress={() => {
                                      deleteImage(image.api_key)
                                  }}
                                  style={styles.croix}
                              >
                                  <View>
                                      <BsTrash size={15} />
                                  </View>
                              </Pressable>
                              <Image source={{ uri: image.secure_url }} style={styles.imagetab} />
                          </View>
                      ))
                    : ""}
            </View>
            {id ? (
                <Pressable
                    onPress={() => {
                        modifierAnnonce()
                    }}
                    style={styles.submitButton}
                >
                    <Text style={styles.submitButtonText}>Valider</Text>
                </Pressable>
            ) : (
                <Pressable
                    onPress={() => {
                        ajouterAnnonce()
                    }}
                    style={styles.submitButton}
                >
                    <Text style={styles.submitButtonText}>Valider</Text>
                </Pressable>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    ////
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
    ////
    container: {
        flex: 1,
    },
    ////////////
    viewTabImage: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "5%",
    },
    ////////
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
        //ajouter
        height: 50,
        flex: 1,
        //fin ajouter
    },
    ///////////
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
    ///////
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
    ///////////
    labelUploadButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
    },
    //////////
    containerDate: {
        // // width: "100%",
        // borderWidth: 1,
        // borderColor: "gray",
        // borderRadius: 5,
        // // marginHorizontal: 20,
        // marginTop: 10,
        // marginBottom: 20,
        flexDirection: "row",
        // alignItems: "center",
    },
    sendButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: "green",
        marginLeft: 10,
        marginRight: 10,
    },
    sendButtonContent: {
        // justifyContent: "center",
        // alignItems: "center",
    },
})

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     formContainer: {
//       padding: 20,
//     },
//     image: {
//       width: 100,
//       height: 100,
//       marginTop: 15,
//     },
//     label: {
//       marginBottom: 5,
//       fontWeight: 'bold',
//     },
//     input: {
//       borderWidth: 1,
//       borderColor: '#ccc',
//       borderRadius: 10,
//       padding: 10,
//       marginBottom: 15,
//       backgroundColor: '#fff',
//     },
//     uploadButton: {
//       borderWidth: 1,
//       borderColor: '#ccc',
//       borderRadius: 10,
//       borderStyle: 'dashed',
//       padding: 20,
//       marginBottom: 15,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     submitButton: {
//       backgroundColor: 'green',
//       borderRadius: 10,
//       padding: 15,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     submitButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },
//   });

export default AddPlantForm
