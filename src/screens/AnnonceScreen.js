import React from "react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    TextInput,
    Touchable,
} from "react-native"
import HeaderComponent from "../components/HeaderComponent"
import Carousel from "../components/Carrousel"

import logo from "../assets/logo.png"
import profil from "../assets/profil.png"
import favicon from "../assets/favicon.png"

const AnnonceScreen = () => {
    const images = [logo, profil, favicon]
    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <Text style={styles.TextCenter}>Nom de la plante</Text>
            <Carousel images={images} imageHeight={200} />
            <View style={styles.descriptionContainer}>
                <View style={styles.description}>
                    <Text style={styles.descriptionText}>Description de la plante...</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Date de gardiennage</Text>
                </View>
            </View>
            <View style={styles.separator}></View>
            <Text style={styles.TextModule}>Module de tchat même visuel ...</Text>
            <View style={styles.separator}></View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    TextCenter: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    welcomeText: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    SafeAreaView: {
        width: "100%",
    },
    ViewGlobale: {
        margin: "5%",
    },
    SearchVille: {
        textAlign: "center",
        marginBottom: "2%",
    },
    imageAnnonce: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    ViewSearchAnnonces: {
        marginTop: "7%",
    },
    ViewAnnonce: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        width: "100%",
    },
    ViewAnnonces: {
        flexDirection: "column",
        width: "90%",
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "7%",
    },
    infoAnnonce: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: "5%",
        flex: 1,
    },
    titreAnnonce: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    villeAnnonce: {
        fontSize: 14,
        color: "#29771D",
        fontWeight: "bold",
        marginBottom: 5,
    },
    dateAnnonce: {
        fontSize: 10,
        color: "#757575",
        textAlign: "right",
    },
    ViewLocalisation: {
        display: "flex",
        flexDirection: "row",
    },
    ViewHeader: {
        width: "100%",
        height: "10%",
        backgroundColor: "#29771D",
    },
    ViewButtons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    ViewButton: {
        margin: "5%",
    },
    TextCenter: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
    },
    SafeAreaView: {
        flex: 1,
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
    separator: {
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
