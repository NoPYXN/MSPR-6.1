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
import * as DocumentPicker from "expo-document-picker"
import { AiFillEdit, AiOutlineClose, AiFillDelete, AiOutlinePlus } from "react-icons/ai"

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
    const [isDelete, setIsDelete] = useState(false)
    const [isVisiblePublication, setIsVisiblePublication] = useState(true)
    const [isVisibleGardiennage, setIsVisibleGardiennage] = useState(false)
    const [isVisibleNotification, setIsVisibleNotification] = useState(false)
    useEffect(() => {
        axios({
            method: "get",
            url: "http://localhost:8080/api/v1/users/" + localStorage.getItem("id"),
            headers: { Authorization: localStorage.getItem("token") },
        })
            .then(data => {
                setUser(data.data.content)
                console.log(data.data.content)
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
        if (data.upload) {
            await axios
                .put("http://localhost:8080/api/v1/users/" + localStorage.getItem("id"), {
                    Image: data.message.secure_url,
                })
                .then(data => {
                    setUser({ ...user, Image: data.data.user.Image })
                    localStorage.setItem("image", data.data.user.Image)
                })
                .catch(err => {
                    console.log(err)
                })
            // console.log(data2, "data2")
        } else {
        }
    }

    const supprimerAnnonce = id => {
        axios
            .delete(`http://localhost:8080/api/v1/annonces/${id}`)
            .then(data => {
                if (data.status == 200) {
                    setIsDelete(true)
                    navigation.replace("HomeScreen", { popup: "Votre annonce a été supprimée" })
                }
            })
            .catch(err => console.log(err))
    }
    const modifierAnnonce = id => {
        navigation.navigate("FormulaireAnnonceScreen", { id: id })
    }

    const showAnnoncePubliee = () => {
        setIsVisibleGardiennage(false)
        setIsVisibleNotification(false)
        setIsVisiblePublication(true)
    }

    const showGardiennage = () => {
        setIsVisibleGardiennage(true)
        setIsVisibleNotification(false)
        setIsVisiblePublication(false)
    }

    const showNotification = () => {
        setIsVisibleNotification(true)
        setIsVisibleGardiennage(false)
        setIsVisiblePublication(false)
    }

    const seDeconnecter = () => {
        const keysToRemove = ["id", "token", "image", "pseudo"]

        keysToRemove.forEach(key => {
            console.log(key)
            console.log()
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key)
            }
        })
        window.location.reload()
    }

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <View style={isVisible ? styles.ViewGlobaleOpacity : styles.ViewGlobale}>
                <View style={styles.profileContainer}>
                    <Pressable onPress={() => handleFileSelected()}>
                        {user.Image ? (
                            <Image source={{ uri: user.Image }} style={styles.icon} />
                        ) : (
                            <Image source={require("../assets/profil.png")} style={styles.icon} />
                        )}
                    </Pressable>
                </View>
                <View style={styles.userInfoContainer}>
                    {user && user.Civilite ? (
                        <Text style={styles.userInfoText}>
                            {user.Civilite.substr(0, 1).toUpperCase() + user.Civilite.slice(1)}
                        </Text>
                    ) : (
                        <Text></Text>
                    )}

                    {user && user.Nom ? (
                        <Text style={styles.userInfoText}>
                            {user.Nom.substr(0, 1).toUpperCase() + user.Nom.slice(1)}
                        </Text>
                    ) : (
                        <Text></Text>
                    )}

                    {user && user.Prenom ? (
                        <Text style={styles.userInfoText}>
                            {user.Prenom.substr(0, 1).toUpperCase() + user.Prenom.slice(1)}
                        </Text>
                    ) : (
                        <Text></Text>
                    )}
                    {user && user.Pseudo ? (
                        <Text style={styles.userInfoText}>
                            {user.Pseudo.substr(0, 1).toUpperCase() + user.Pseudo.slice(1)}
                        </Text>
                    ) : (
                        <Text></Text>
                    )}
                    <Text style={styles.userInfoText}>{user.Email}</Text>
                    {user && user.Ville ? (
                        <Text style={styles.userInfoText}>
                            {user.Ville.substr(0, 1).toUpperCase() + user.Ville.slice(1)}
                        </Text>
                    ) : (
                        <Text></Text>
                    )}

                    {user.Botanniste ? (
                        <View style={styles.botanistContainer}>
                            <Text style={styles.userInfoText}>Botanniste </Text>
                            <BsCheck color="green" />
                        </View>
                    ) : (
                        <Text style={styles.userInfoText2}>Devenir Botanniste ?</Text>
                    )}
                </View>
                <Pressable style={styles.editButton} onPress={() => setIsVisible(true)}>
                    <AiFillEdit size={24} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        seDeconnecter()
                    }}
                    style={{ backgroundColor: "grey", padding: "2%", borderRadius: "5px" }}
                >
                    <Text>Se déconnecter</Text>
                </Pressable>
            </View>
            <View style={{ height: "5%" }}></View>
            <View style={{ width: "90%", marginRight: "5%", marginLeft: "5%" }}>
                <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <Pressable
                        style={
                            !isVisiblePublication
                                ? { width: "50%", backgroundColor: "#f0f0f0", padding: "5%" }
                                : { width: "50%", backgroundColor: "green", padding: "5%" }
                        }
                        onPress={() => {
                            showAnnoncePubliee()
                        }}
                    >
                        <Text
                            style={
                                !isVisiblePublication
                                    ? {
                                          textAlign: "center",
                                          fontSize: "16px",
                                          color: "black",
                                      }
                                    : {
                                          textAlign: "center",
                                          fontSize: "16px",
                                          color: "white",
                                      }
                            }
                        >
                            Publication
                        </Text>
                    </Pressable>
                    <Pressable
                        style={
                            isVisibleGardiennage
                                ? {
                                      width: "50%",
                                      backgroundColor: "green",
                                      padding: "5%",
                                  }
                                : {
                                      width: "50%",
                                      backgroundColor: "#f0f0f0",
                                      padding: "5%",
                                  }
                        }
                        onPress={() => {
                            showGardiennage()
                        }}
                    >
                        <Text
                            style={
                                isVisibleGardiennage
                                    ? {
                                          fontSize: "16px",
                                          textAlign: "center",
                                          color: "white",
                                      }
                                    : { textAlign: "center", fontSize: "16px", color: "black" }
                            }
                        >
                            Gardiennage
                        </Text>
                    </Pressable>
                </View>
                {isVisiblePublication ? (
                    user && user.Annonces ? (
                        <View style={styles.ViewAnnonces}>
                            {user.Annonces.map(item => (
                                <View key={item.Id_Annonce} style={styles.ViewActions}>
                                    <Pressable
                                        onPress={() => {
                                            navigation.navigate({
                                                name: "AnnonceScreen",
                                                params: { id: item.Id_Annonce },
                                            })
                                        }}
                                        style={{ width: "80%" }}
                                    >
                                        <View style={styles.ViewAnnonceAvecActions}>
                                            <Image
                                                style={styles.imageAnnonceAvecActions}
                                                source={{
                                                    uri: item.Id_Plante[0],
                                                }}
                                            />

                                            <View style={styles.infoAnnonce}>
                                                <Text style={styles.titreAnnonceAvecActions}>
                                                    {item.Titre.charAt(0).toUpperCase() +
                                                        item.Titre.slice(1)}
                                                </Text>
                                                <Text style={styles.villeAnnonceAvecActions}>
                                                    {item.Ville}
                                                </Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                    <View style={styles.BoutonsActions}>
                                        <Pressable
                                            onPress={() => {
                                                modifierAnnonce(item.Id_Annonce)
                                            }}
                                        >
                                            <AiFillEdit size={20} />
                                        </Pressable>
                                        <Pressable
                                            onPress={() => {
                                                supprimerAnnonce(item.Id_Annonce)
                                            }}
                                        >
                                            <AiFillDelete size={20} />
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.noAnnouncementsText}>Vous avez aucune annonce</Text>
                        </View>
                    )
                ) : (
                    <View></View>
                )}
                {isVisibleGardiennage ? (
                    user && user.Gardiennage ? (
                        <View style={styles.ViewAnnonces}>
                            {user.Gardiennage.map(item => (
                                <View key={item.Id_Annonce} style={styles.ViewActions}>
                                    <Pressable
                                        onPress={() => {
                                            navigation.navigate({
                                                name: "AnnonceScreen",
                                                params: { id: item.Id_Annonce },
                                            })
                                        }}
                                        style={{ width: "80%" }}
                                    >
                                        <View style={styles.ViewAnnonceAvecActions}>
                                            <Image
                                                style={styles.imageAnnonceAvecActions}
                                                source={{
                                                    uri: item.Id_Plante[0],
                                                }}
                                            />

                                            <View style={styles.infoAnnonce}>
                                                <Text style={styles.titreAnnonceAvecActions}>
                                                    {item.Titre.charAt(0).toUpperCase() +
                                                        item.Titre.slice(1)}
                                                </Text>
                                                <Text style={styles.villeAnnonceAvecActions}>
                                                    {item.Ville}
                                                </Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.noAnnouncementsText}>
                                Vous n'avez aucune plante à garder
                            </Text>
                        </View>
                    )
                ) : (
                    <View></View>
                )}
                :
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
    SafeAreaView: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        paddingHorizontal: 16,
    },
    profileContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: 20,
    },
    icon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    labelUploadButton: {
        color: "#007BFF",
        fontSize: 16,
        textDecorationLine: "underline",
    },
    userInfoContainer: {
        marginBottom: 20,
    },
    userInfoText: {
        fontSize: 18,
        marginBottom: 8,
        textAlign: "center",
    },
    userInfoText2: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: "center",
        textDecorationLine: "underline",
        fontStyle: "italic",
    },
    botanistContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    editButton: {
        alignSelf: "center",
        padding: 10,
        borderRadius: 50,
        backgroundColor: "#f0f0f0",
        marginBottom: 20,
    },
    announcementsContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    announcementsHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    noAnnouncementsText: {
        fontSize: 16,
        color: "#888",
    },
    ViewGlobale: {
        paddingHorizontal: "5%",
        marginTop: 20,
    },
    ViewGlobaleOpacity: {
        paddingHorizontal: "5%",
        marginTop: 20,
        opacity: 0.2,
    },
    ViewAnnonces: {
        flexDirection: "column",
        width: "100%",
        // marginLeft: "5%",
        // marginRight: "5%",
        marginTop: "7%",
    },
    ViewActions: {
        display: "flex",
        flexDirection: "row",
    },
    BoutonsActions: {
        width: "15%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ViewAnnonceAvecActions: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        width: "100%",
    },
    imageAnnonceAvecActions: {
        width: 80,
        height: 80,
        borderRadius: 100,
        marginBottom: 10,
    },
    infoAnnonce: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: "5%",
        flex: 1,
    },
    titreAnnonceAvecActions: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    villeAnnonceAvecActions: {
        fontSize: 12,
        color: "#29771D",
        fontWeight: "bold",
        marginBottom: 5,
    },
})
export default ProfilScreen
