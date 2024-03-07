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
    // const [selectedImage, setSelectedImage] = useState(null)
    const [messages, setMessages] = useState([])
    const [blocMessages, setBlocMessages] = useState([])
    const [numero, setNumero] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [selectedImages, setSelectedImages] = useState([
        // "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/cf2n96vnymuxuogwarmr.webp",
    ])

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/annonces/${router.params.id}`)
            .then(data => {
                if (data.status == 200) {
                    data.data.content.DateDebut = convertirDate(data.data.content.DateDebut)
                    data.data.content.DateFin = convertirDate(data.data.content.DateFin)
                    setAnnonce(data.data.content)
                    setImages(data.data.content.Id_Plante)
                    setBlocMessages(data.data.content.Conseils.sort(sortDateConseils))
                    // setSelectedImages(data.data.content.EtatPlantes)

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

    // const handleImageSelect = imageUri => {
    //     // setSelectedImage(imageUri)
    //     // console.log("Image selected:", imageUri)
    // }

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <Text style={styles.TextCenter}>
                {annonce.Titre && annonce.Titre.length > 0
                    ? annonce.Titre.charAt(0).toUpperCase() + annonce.Titre.slice(1)
                    : "Pas de titre"}
            </Text>
            <Carousel images={images} imageHeight={200} />
            <View style={styles.blocInfo}>
                <Text style={styles.descriptionText}>
                    {annonce.Description && annonce.Description.length > 0
                        ? annonce.Description.charAt(0).toUpperCase() + annonce.Description.slice(1)
                        : "Pas de description"}
                </Text>
                <Text style={styles.descriptionText}>{annonce.Ville}</Text>
                {/* <Text style={styles.infosTitreText}>Date de gardiennage</Text> */}
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

            <PhotoPicker
                // onImageSelect={handleImageSelect}
                setSelectedImages={setSelectedImages}
                selectedImages={selectedImages}
            />

            <View style={styles.separateur}></View>

            <View style={styles.messageContainer}>
                <Text style={styles.TextIndication}>Avez-vous des indications à transmettre ?</Text>
                <TextZoneInfo messages={messages} setMessages={setMessages} />
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
        // padding: 1,
        marginHorizontal: "6%",
    },
    TextModule: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
        paddingVertical: 70,
    },
    messageContainer: {
        // paddingHorizontal: 20,
        // paddingVertical: 10,
        // marginHorizontal: 20,
        // marginTop: 10,
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
        // marginBottom: 10,
        justifyContent: "space-between",
    },
})
export default AnnonceScreen
