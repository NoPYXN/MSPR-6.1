import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TextInput, SafeAreaView} from "react-native"
import { useNavigation} from "@react-navigation/native"

import HeaderComponent from "../components/HeaderComponent"
import Carousel from "../components/CarrouselComponent"
import PhotoPicker from "../components/SelectionPhotosComponent"
import TextZoneInfo from "../components/TextZoneInfoComponent"

const AnnonceScreen = () => {
    
    const navigation = useNavigation()

    // const logo = "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif"
    // const profil = "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif"
    // const favicon = "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif"
    // const images = [logo, profil, favicon];

    const [images, setImages] = useState([])

    useEffect(() => {setImages(["https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif", "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif", "https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/plante_kqt4sg.avif"])},[])

    const handleSubmission = (text) => {
        // Logique de soumission ou d'envoi des données du texte
        console.log('Text submitted:', text);
    };
    const handleImageSelect = (imageUri) => {
        // Logique à exécuter lorsque l'image est sélectionnée
        console.log('Image selected:', imageUri);
        // Vous pouvez stocker l'URI de l'image dans un état ou effectuer toute autre opération nécessaire
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
            <Text style={styles.TextModule}>Module de tchat (même visuel...)</Text>
            <View style={styles.separateur}></View>
            <PhotoPicker onImageSelect={handleImageSelect} />
            <View style={styles.separateur}></View>
            <Text style={styles.TextIndication}>Avez-vous des indications a transmettre ?</Text>
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
})
export default AnnonceScreen