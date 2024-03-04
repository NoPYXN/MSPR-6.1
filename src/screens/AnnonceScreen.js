import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TextInput, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from expo

import HeaderComponent from "../components/HeaderComponent"
import Carousel from "../components/CarrouselComponent"
import PhotoPicker from "../components/SelectionPhotosComponent"
import TextZoneInfo from "../components/TextZoneInfoComponent"

const AnnonceScreen = () => {

    const navigation = useNavigation()

    const [images, setImages] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setImages(["https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif", "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif", "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif"])
    }, [])

    const handleSubmission = (text) => {
        setMessages([...messages, {text, time: new Date()}]) // Store text and time
        console.log('Text submitted:', text);
    };

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageSelect = (imageUri) => {
        setSelectedImage(imageUri);
        console.log('Image selected:', imageUri);
    };

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <Text style={styles.TextCenter}>Nom de la plante</Text>
            <Carousel images={images} imageWidth={200} imageHeight={200} />
            <View style={styles.descriptionContainer}>
                <View style={styles.description}>
                    <Text style={styles.descriptionText}>
                        Description de la plante...
                    </Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                        Date de gardiennage
                    </Text>
                </View>
            </View>
            <View style={styles.separateur}></View>
            
            <PhotoPicker onImageSelect={handleImageSelect} />
            <View style={styles.separateur}></View>
            <View style={styles.messageContainer}>
                {messages.map((message, index) => (
                    <View key={index} style={styles.message}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person-circle-outline" size={24} color="black" />
                            <Text style={styles.pseudo}>Anonyme</Text>
                        </View>
                        <View style={styles.messageContent}>
                            <Text style={styles.messageText}>{message.text}</Text>
                            <Text style={styles.messageTime}>{message.time.toLocaleString()}</Text>
                        </View>
                    </View>
                ))}
            </View>
            <Text style={styles.TextIndication}>Avez-vous des indications à transmettre ?</Text>
            <TextZoneInfo onSubmit={handleSubmission} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    TextCenter: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
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
    },
    descriptionContainer: {
        flexDirection: "row",
        padding: 20,
    },
    description: {
        flex: 1,
    },
    descriptionText: {
        fontSize: 16,
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
        height: 1,
        backgroundColor: "black",
        padding: 1,
        marginHorizontal: 30,
    },
    TextModule: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
        paddingVertical: 70,
    },
    messageContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 20,
        marginTop: 10,
        
    },
    message: {
        flexDirection: "row",
        marginBottom: 10,
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
        textAlign: "right",
    },
})

export default AnnonceScreen
