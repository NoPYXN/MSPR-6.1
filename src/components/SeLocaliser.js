import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importation des icônes d'Expo

import SearchSeLocaliser from "./SearchSeLocaliser";

const SeLocaliser = ({
    setIsVisibleLocalisation,
    localization,
    setLocalization,
    navigation,
    isLoaded,
}) => {
    const [radius, setRadius] = useState("");

    const handleSubmit = () => {
        navigation.navigate("MapScreen", {
            lat: localization.localization.lat,
            lng: localization.localization.lng,
            radius: radius,
            country: localization.country,
        });
    };

    return (
        <View style={styles.viewGlobale}>
            <View style={styles.view}>
                <Text style={styles.titre}>Se localiser</Text>
                <Pressable onPress={() => setIsVisibleLocalisation(false)}>
                    <Ionicons name="close" style={styles.close} size={20} />
                </Pressable>
            </View>
            <View style={styles.ligne}></View>
            <Text>Choisissez une adresse à saisir</Text>
            <SearchSeLocaliser
                setCoordonnees={setLocalization}
                coordonnees={localization}
                isLoaded={isLoaded}
            />
            <Text>Saisir un nombre de kilomètres</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => {
                    setRadius(text);
                }}
            />
            <Pressable style={styles.bouton} onPress={handleSubmit}>
                <Text style={styles.text}>Valider</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    viewGlobale: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
        alignItems: "center",
        justifyContent: "center",
        width: "70%",
        padding: "5%",
        backgroundColor: "white",
        borderRadius: 5,
        borderColor: "black",
        borderWidth: 2,
        zIndex: 1,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 5,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "100%",
    },
    titre: {
        fontSize: 20,
        fontWeight: "bold",
    },
    ligne: {
        marginBottom: "8%",
        marginTop: "5%",
        width: "100%",
        height: 1,
        backgroundColor: "black",
    },
    bouton: {
        borderWidth: 1,
        borderRadius: 5,
        padding: "5%",
        width: "100%",
        backgroundColor: "black",
        marginTop: "3%",
    },
    text: {
        textAlign: "center",
        color: "white",
    },
    view: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    close: {
        alignSelf: "center",
    },
});

export default SeLocaliser;
