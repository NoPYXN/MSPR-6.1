import React, { useState, useEffect } from "react"
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native"
import ResearchBar from "./ResearchBar"
import * as DocumentPicker from "expo-document-picker"
import { BsTrash } from "react-icons/bs"
import axios from "axios"
import { AiTwotoneCalendar } from "react-icons/ai"
import { convertirDateCalendrier } from "../utils/ConvertirDateCalendrier"

let DatePicker
// if (Platform.OS === "web") {
DatePicker = require("react-datepicker").default
require("react-datepicker/dist/react-datepicker.css")
// }

const AddPlantForm = ({ navigation, id, router }) => {
    const [isAddPlantFrom, setIsAddPlantFrom] = useState(true)
    const [searchVille, setSearchVille] = useState()
    const [coordonnees, setCoordonnees] = useState()
    const [selected, setSelected] = useState()
    const [selectedImage, setSelectedImage] = useState()
    const [isChangeUploadFile, setIsChangeUploadFile] = useState(false)
    const [tabImages, setTabImages] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [date1, setDate1] = useState(new Date())
    const [date2, setDate2] = useState(new Date())
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [annonce, setAnnonce] = useState({})
    const [newDate1, setNewDate1] = useState("")
    const [newDate2, setNewDate2] = useState("")
    const [message, setMessage] = useState("")

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date1
        setShow1(Platform.OS === "ios") // Only relevant for iOS, to keep the picker open
        setDate1(currentDate)
    }

    const convertirDate = dateString => {
        const date = new Date(dateString)

        const jour = ("0" + date.getDate()).slice(-2)
        const mois = ("0" + (date.getMonth() + 1)).slice(-2)
        const annee = date.getFullYear()

        const dateFormatee = `${jour}/${mois}/${annee}`

        return dateFormatee
    }

    useEffect(() => {
        let x = convertirDateCalendrier(date1)
        let y = convertirDateCalendrier(date2)
        setNewDate1(x)
        setNewDate2(y)
        setAnnonce({ ...annonce, DateDebut: x, DateFin: y })
    }, [date1, date2])

    useEffect(() => {
        if (id) {
            async function test() {
                await axios
                    .get(`http://localhost:8080/api/v1/annonces/${id}`)
                    .then(data => {
                        if (data.status == 200) {
                            data.data.content.DateDebut = convertirDate(data.data.content.DateDebut)
                            data.data.content.DateFin = convertirDate(data.data.content.DateFin)
                            setAnnonce(data.data.content)
                            setNewDate1(data.data.content.DateDebut)
                            setNewDate2(data.data.content.DateFin)
                            let tab = []
                            data.data.content.Id_Plante.forEach(element => {
                                tab.push({
                                    secure_url: element,
                                    api_key: element.split("/Arosaje/annonces/")[1].split(".")[0],
                                })
                            })
                            setTabImages(tab)
                        }
                    })
                    .catch(err => {})
            }

            test()
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
        const response = await fetch(`http://localhost:8080/api/v1/upload/uploadPhotoUser`, {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        if (data.upload) {
            setTabImages([
                ...tabImages,
                {
                    api_key: data.message.public_id.split("Arosaje/annonces/")[1],
                    secure_url: data.message.secure_url,
                },
            ])
        } else {
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
        console.log("dans fonction ajouter annonce")
        let tab = []
        tabImages.forEach(element => {
            tab.push(element.secure_url)
        })
        await axios
            .post(`http://localhost:8080/api/v1/annonces`, { ...annonce, Id_Plante: tab })
            .then(data => {
                console.log(data)
                if (data.status == 201) {
                    navigation.replace("HomeScreen", { popup: "Votre annonce a bien été ajoutée" })
                }
                if (data.status == 200) {
                    setMessage(data.data.message)
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
            <View style={styles.containerDate}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setAnnonce({ ...annonce, DateDebut: text })}
                    placeholder="Sélectionnez une date"
                    value={newDate1 || annonce?.DateDebut || ""}
                />
                <Pressable
                    onPress={() => {
                        show1 ? setShow1(false) : setShow1(true)
                    }}
                >
                    <View style={styles.sendButton}>
                        <AiTwotoneCalendar size={30} />
                    </View>
                </Pressable>
            </View>
            {show1 && DatePicker && (
                <DatePicker selected={date1} onChange={newDate => setDate1(newDate)} inline />
            )}
            <Text style={styles.label}>Date de fin de gardiennage</Text>
            <View style={styles.containerDate}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setAnnonce({ ...annonce, DateFin: text })}
                    placeholder="Sélectionnez une date"
                    value={newDate2 || annonce?.DateFin || ""}
                />
                <Pressable
                    onPress={() => {
                        show2 ? setShow2(false) : setShow2(true)
                    }}
                >
                    <View style={styles.sendButton}>
                        <AiTwotoneCalendar size={30} />
                    </View>
                </Pressable>
            </View>

            {/* {show && Platform.OS !== "web" && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onChange} />
            )} */}
            {/* {show && Platform.OS === "web" && DatePicker && (
                <DatePicker selected={date} onChange={newDate => setDate(newDate)} inline />
            )} */}

            {show2 && DatePicker && (
                <DatePicker selected={date2} onChange={newDate => setDate2(newDate)} inline />
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
                // isLoaded={isLoaded}
            />

            <Text style={styles.label}>Télécharger des images</Text>

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
            {message ? (
                <View>
                    <Text style={{ color: "red" }}>{message}</Text>
                </View>
            ) : (
                <View></View>
            )}
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
        height: 50,
        flex: 1,
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
    containerDate: {
        flexDirection: "row",
    },
    sendButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: "green",
        marginLeft: 10,
        marginRight: 10,
    },
})

export default AddPlantForm
