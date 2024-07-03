import React, { useState, useEffect } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { StyleSheet, Text, View, FlatList, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Utilisation d'Ionicons de @expo/vector-icons
import axios from "axios";

import { NumeroPage } from "../utils/NumeroPage";

// Composant principal
export default function Index({
    setSearchVille,
    setCoordonnees,
    setSelected,
    searchVille,
    setCalculPage,
    setAnnonces,
    pageChoisie,
    selected,
    isAddPlantFrom,
    annonces,
    valueVille,
    isVisiblePublication,
    isVisibleGardiennage,
}) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simuler le chargement de la bibliothèque Google Maps (à remplacer par votre propre logique de chargement)
        setTimeout(() => {
            setIsLoaded(true);
        }, 1000);
    }, []);

    if (!isLoaded) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <Map
            setSearchVille={setSearchVille}
            setCoordonnees={setCoordonnees}
            setSelected={setSelected}
            searchVille={searchVille}
            setCalculPage={setCalculPage}
            setAnnonces={setAnnonces}
            pageChoisie={pageChoisie}
            selected={selected}
            isAddPlantFrom={isAddPlantFrom}
            annonces={annonces}
            valueVille={valueVille}
            isVisiblePublication={isVisiblePublication}
            isVisibleGardiennage={isVisibleGardiennage}
        />
    );
}

// Composant Map
function Map({
    setSearchVille,
    setCoordonnees,
    setSelected,
    searchVille,
    setAnnonces,
    setCalculPage,
    pageChoisie,
    selected,
    isAddPlantFrom,
    annonces,
    valueVille,
    isVisiblePublication,
    isVisibleGardiennage,
}) {
    return (
        <View>
            <View>
                <PlacesAutocomplete
                    setSearchVille={setSearchVille}
                    setSelected={setSelected}
                    setCoordonnees={setCoordonnees}
                    searchVille={searchVille}
                    setCalculPage={setCalculPage}
                    setAnnonces={setAnnonces}
                    pageChoisie={pageChoisie}
                    selected={selected}
                    isAddPlantFrom={isAddPlantFrom}
                    annonces={annonces}
                    valueVille={valueVille}
                    isVisiblePublication={isVisiblePublication}
                    isVisibleGardiennage={isVisibleGardiennage}
                />
            </View>
        </View>
    );
}

// Composant PlacesAutocomplete
const PlacesAutocomplete = ({
    setSelected,
    setSearchVille,
    setCoordonnees,
    searchVille,
    setCalculPage,
    setAnnonces,
    pageChoisie,
    selected,
    isAddPlantFrom,
    annonces,
    valueVille,
    isVisibleGardiennage,
    isVisiblePublication,
}) => {
    const [value, setValue] = useState(valueVille || "");
    const [suggestions, setSuggestions] = useState([]);
    const [countryChoice, setCountryChoice] = useState("");

    useEffect(() => {
        if (valueVille) {
            setValue(valueVille);
            console.log("value", value);
        }
        console.log("111111111", valueVille);
    }, []);

    const handleSelect = async address => {
        setValue(address, false);
        setSuggestions([]);
        const results = await getGeocode({ address });
        const { lat, lng } = getLatLng(results[0]);
        setSearchVille(address.split(",")[0]);
        setCoordonnees({ lat, lng });
        setSelected(true);
        setCountryChoice(address.split(",")[0]);
        if (isAddPlantFrom) {
            setAnnonces({
                ...annonces,
                Ville: address.split(",")[0],
                Latitude: lat,
                Longitude: lng,
            });
        }
    };

    const changeUrlVille = ville => {
        // Remplacez par votre propre logique de changement d'URL si nécessaire
        console.log("Change URL to:", ville);
    };

    const search = () => {
        NumeroPage(countryChoice, isVisiblePublication, isVisibleGardiennage).then(numero => {
            setCalculPage(numero);
        });

        if (selected) {
            axios
                .get(
                    `http://localhost:8080/api/v1/annonces?page=${
                        pageChoisie ? pageChoisie : 0
                    }&Ville=${countryChoice}&IsVisiblePublication=${isVisiblePublication}&IsVisibleGardiennage=${isVisibleGardiennage}`,
                )
                .then(data => {
                    if (data.status == 200) {
                        setAnnonces(data.data.content);
                        changeUrlVille(countryChoice);
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <View>
            <View style={styles.container}>
                <View style={isAddPlantFrom ? styles.divInputIdAddPlantForm : styles.divInput}>
                    <TextInput
                        value={value ?? ""}
                        onChangeText={text => setValue(text)}
                        editable
                        style={isAddPlantFrom ? styles.inputIsAddPlantForm : styles.input}
                        placeholder={isAddPlantFrom ? "Sélectionnez la ville" : searchVille}
                    />
                    {!isAddPlantFrom && (
                        <Pressable
                            style={styles.iconSearch}
                            onPress={() => {
                                search();
                            }}
                        >
                            <Ionicons name="search" size={20} color="black" />
                        </Pressable>
                    )}
                </View>
            </View>

            <View style={isAddPlantFrom ? styles.ViewXXIdAddPlantForm : styles.ViewXX}>
                {suggestions.length > 0 && (
                    <FlatList
                        data={suggestions
                            .filter(({ types }) => types.includes("locality"))
                            .filter(({ terms }) => terms.some(obj => obj.value === "France"))}
                        keyExtractor={item => item.place_id}
                        renderItem={({ item }) => (
                            <View style={styles.ViewFlatList}>
                                <Pressable
                                    onPress={() => handleSelect(item.description)}
                                    style={styles.listItem}
                                >
                                    <Text>{item.description}</Text>
                                </Pressable>
                            </View>
                        )}
                        style={styles.list}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        flex: 1,
        width: "50%",
        padding: 8,
        borderWidth: 2,
        borderColor: "#ccc",
        borderRadius: 5,
        fontSize: 16,
    },
    divInput: {
        flexDirection: "row",
        alignItems: "center",
        width: "60%",
        position: "relative",
    },
    divInputIdAddPlantForm: {
        width: "100%",
    },
    inputIsAddPlantForm: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    iconSearch: {
        position: "absolute",
        right: 10,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    ViewFlatList: {
        justifyContent: "center",
        alignItems: "flex-start",
    },
    ViewXX: {
        width: "55%",
        marginLeft: "auto",
        marginRight: "auto",
        zIndex: 1,
    },
    ViewXXIdAddPlantForm: {
        marginLeft: "2%",
    },
});
