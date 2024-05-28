import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, Image, SafeAreaView, Pressable } from "react-native"
import { useNavigation, useParams, useRoute } from "@react-navigation/native"
import axios from "axios"
import { Ionicons } from "@expo/vector-icons" // Import Ionicons from expo

import HeaderComponent from "../components/HeaderComponent"
import Carousel from "../components/CarrouselComponent"
import PhotoPicker from "../components/SelectionPhotosComponent"
import TextZoneInfo from "../components/TextZoneInfoComponent"

import { ConvertirDateHeure } from "../utils/ConvertirDateHeure"
import { convertirDate } from "../utils/ConvertiDate"
import { sortDateConseils } from "../utils/AffichageConseils"

const AnnonceScreen = () => {
    const [annonce, setAnnonce] = useState({})
    const navigation = useNavigation()
    const router = useRoute()
    const [images, setImages] = useState([])
    const [messages, setMessages] = useState([])
    const [blocMessages, setBlocMessages] = useState([])
    const [numero, setNumero] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [selectedImages, setSelectedImages] = useState([])
    const [id, setId] = useState()
    const [isClicked, setIsClicked] = useState(false)

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/annonces/${router.params.id}`)
            .then(data => {
                if (data.status == 200) {
                    console.log("data getif annonce", data)
                    data.data.content.DateDebut = convertirDate(data.data.content.DateDebut)
                    data.data.content.DateFin = convertirDate(data.data.content.DateFin)
                    setAnnonce(data.data.content)
                    setImages(data.data.content.Id_Plante)
                    setBlocMessages(data.data.content.Conseils.sort(sortDateConseils))
                    setSelectedImages(data.data.content.EtatPlantes)

                    setId(router.params.id)
                    if (data.data.content.Conseils.length <= 2) {
                        setMessages(data.data.content.Conseils)
                        setIsVisible(false)
                    } else {
                        let tab = []
                        for (let i = numero; i < numero + 2; i++) {
                            tab.push(data.data.content.Conseils[i])
                        }
                        setMessages(tab)
                        setNumero(numero + 2)
                        setIsVisible(true)
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const afficherPlus = () => {
        let tab = []
        let i = numero
        while (blocMessages.length >= i + 1 && tab.length < 2) {
            tab.push(blocMessages[i])
            i += 1
        }
        setMessages(messages.concat(tab))
        setNumero(numero + 2)
        if (blocMessages.length <= numero + 2) {
            setIsVisible(false)
        }
    }

    const demandeGardePlante = async () => {
        // let x = []
        await axios
            .post(`http://localhost:8080/api/v1/gardePlantes`, {
                UtilisateurProprietaire: annonce.AnnonceUser,
                UtilisateurGardien: parseInt(localStorage.getItem("id")),
                Annonces: annonce.Id_Annonce,
            })
            .then(data => {
                console.log(data, "GARDEPLANTES POST")
            })
            .catch(err => console.log(err))
        //axios.put(`http://localhost:8080/api/v1/annonces/${router.params.id}`, { Etat: true })
    }

    const demandeGardiennage = async () => {
        if (isClicked) {
            setIsClicked(false)
            await axios
                .put(`http://localhost:8080/api/v1/annonces/${id}`, {
                    AnnonceUserGard: parseInt(localStorage.getItem("id")),
                    Etat: true,
                })
                .then(data => {
                    if (data.status == 200) {
                        console.log(data)
                        window.location.reload() //à garder car recharge la page mais retourne sur la home
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            setIsClicked(true)
        }
    }

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <Text style={styles.TextCenter}>
                {annonce.Titre && annonce.Titre.length > 0
                    ? annonce.Titre.charAt(0).toUpperCase() + annonce.Titre.slice(1)
                    : "Pas de titre"}
            </Text>
            <Carousel images={images} imageHeight={100} />
            {annonce && annonce.AnnonceUserGard ? (
                <View>
                    <Text>Annonce gardé par</Text>
                    {annonce.AnnonceGardien.Image ? (
                        <Image
                            source={{ uri: annonce.AnnonceGardien.Image }}
                            style={styles.iconImage}
                        />
                    ) : (
                        <Image source={require("../assets/profil.png")} style={styles.icon} />
                    )}
                    <Text>{annonce.AnnonceGardien.Pseudo}</Text>
                </View>
            ) : (
                <Pressable
                    style={
                        isClicked
                            ? {
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  width: "50%",
                                  borderRadius: "5px",
                                  padding: "5%",
                                  backgroundColor: "green",
                                  marginTop: "5%",
                              }
                            : {
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  width: "50%",
                                  borderRadius: "5px",
                                  padding: "5%",
                                  backgroundColor: "grey",
                                  marginTop: "5%",
                              }
                    }
                    onPress={() => {
                        demandeGardiennage()
                    }}
                >
                    <Text style={{ color: "white", textAlign: "center" }}>
                        Demande de gardiennage
                    </Text>
                </Pressable>
            )}

            <View style={styles.blocInfo}>
                <Text style={styles.descriptionText}>
                    {annonce.Description && annonce.Description.length > 0
                        ? annonce.Description.charAt(0).toUpperCase() + annonce.Description.slice(1)
                        : "Pas de description"}
                </Text>
                <Text style={styles.descriptionText}>{annonce.Ville}</Text>
                <View style={styles.descriptionContainer}>
                    <View style={styles.description}>
                        <Text style={styles.infosText}>Début : {annonce.DateDebut}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>Fin : {annonce.DateFin}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.separateur}></View>
            {annonce.Annonce ? (
                <View>
                    <Text>Contacter le propriétaire</Text>
                    {annonce.Annonce.Image ? (
                        <Image source={{ uri: annonce.Annonce.Image }} style={styles.iconImage} />
                    ) : (
                        <Image source={require("../assets/profil.png")} style={styles.icon} />
                    )}
                    <Text>{annonce.Annonce.Pseudo}</Text>
                </View>
            ) : (
                <View></View>
            )}
            <View style={styles.separateur}></View>

            <PhotoPicker
                setSelectedImages={setSelectedImages}
                selectedImages={selectedImages}
                id={id}
            />

            <View style={styles.separateur}></View>

            <View style={styles.messageContainer}>
                <Text style={styles.TextIndication}>Avez-vous des indications à transmettre ?</Text>
                {id ? (
                    <TextZoneInfo messages={messages} setMessages={setMessages} id={id} />
                ) : (
                    <View></View>
                )}
                {messages.length != 0 ? (
                    messages.sort(sortDateConseils).map((message, index) => (
                        <View key={index} style={styles.message}>
                            <View style={styles.infosMessage}>
                                <View style={styles.avatarContainer}>
                                    <Ionicons
                                        name="person-circle-outline"
                                        size={24}
                                        color="black"
                                    />
                                    <Text style={styles.pseudo}>{message.Username}</Text>
                                </View>
                                <Text style={styles.messageTime}>
                                    {ConvertirDateHeure(message.DateCreation)}
                                </Text>
                            </View>
                            <View style={styles.messageContent}>
                                <Text style={styles.messageText}>{message.Message}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View></View>
                )}
                {isVisible ? (
                    <Pressable
                        onPress={() => {
                            afficherPlus()
                        }}
                    >
                        <Text style={{ textAlign: "center", marginTop: "2%", marginBottom: "2%" }}>
                            Afficher plus
                        </Text>
                    </Pressable>
                ) : (
                    <View></View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    TextCenter: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
        padding: 10,
    },
    TextIndication: {
        paddingTop: 10,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    SafeAreaView: {
        width: "100%",
        backgroundColor: "white",
    },
    descriptionContainer: {
        flexDirection: "row",
    },
    blocInfo: {
        padding: "6%",
    },
    description: {
        flex: 1,
    },
    infosText: {
        fontSize: 16,
    },
    infosTitreText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: "3%",
    },
    descriptionText: {
        fontSize: 16,
        marginBottom: "5%",
    },
    dateContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    dateText: {
        fontSize: 16,
        textAlign: "right",
    },
    separateur: {
        height: "1px",
        backgroundColor: "black",
        marginHorizontal: "6%",
    },
    TextModule: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
        paddingVertical: 70,
    },
    messageContainer: {
        paddingHorizontal: "3%",
        paddingVertical: "2%",
        marginHorizontal: "3%",
        marginTop: "2%",
    },
    message: {
        flexDirection: "column",
        marginBottom: "2%",
        marginTop: "2%",
    },
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
    },
    pseudo: {
        marginLeft: 5,
        fontWeight: "bold",
    },
    messageContent: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    messageText: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        color: "#888",
        marginTop: "auto",
        marginBottom: "auto",
        marginRight: "1%",
    },
    infosMessage: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    icon: {
        width: 25,
        height: 25,
        // resizeMode: "contain",
        objectFit: "contain",
        borderRadius: "50%",
    },
    iconImage: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        // resizeMode: "contain",
        objectFit: "contain",
    },
})
export default AnnonceScreen
