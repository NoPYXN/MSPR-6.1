import React, { useState, useEffect } from "react"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { StyleSheet, Text, View, FlatList, TextInput, Pressable } from "react-native"
import { FaSearch } from "react-icons/fa"
import axios from "axios"
import { useLoadScript } from "@react-google-maps/api"

import { NumeroPage } from "../utils/NumeroPage"

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
    // isLoaded,
}) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBnyp6JiXQAqF0VIfj9-cIt-OPjehWhY9E",
        libraries: ["places"],
    })

    if (!isLoaded) return <div>Loading...</div>
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
        />
    )
}
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
                />
            </View>
        </View>
    )
}

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
}) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            types: ["geocode"],
        },
    })

    const [countryChoice, setCountryChoice] = useState("")

    useEffect(() => {
        if (valueVille) {
            setValue(valueVille)
            console.log("value", value)
        }
        console.log("111111111", valueVille)
    }, [])

    const handleSelect = async address => {
        setValue(address, false)
        clearSuggestions()
        const results = await getGeocode({ address })
        const { lat, lng } = getLatLng(results[0])
        setSearchVille(address.split(",")[0])
        setCoordonnees({ lat: lat, lng: lng })
        setSelected(true)
        setCountryChoice(address.split(",")[0])
        if (isAddPlantFrom) {
            setAnnonces({
                ...annonces,
                Ville: address.split(",")[0],
                Latitude: lat,
                Longitude: lng,
            })
        }
    }

    const changeUrlVille = ville => {
        window.history.pushState({ page: ville }, "", "?page=1&ville=" + ville)
    }

    const search = () => {
        NumeroPage(countryChoice).then(numero => {
            setCalculPage(numero)
        })
        if (selected) {
            axios
                .get(
                    `http://localhost:8080/api/v1/annonces?page=${
                        pageChoisie ? pageChoisie : 0
                    }&Ville=${countryChoice}`,
                )
                .then(data => {
                    if (data.status == 200) {
                        setAnnonces(data.data.content)
                        changeUrlVille(countryChoice)
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={isAddPlantFrom ? styles.divInputIdAddPlantForm : styles.divInput}>
                    <TextInput
                        value={value ?? ""}
                        onChangeText={text => setValue(text)}
                        // readOnly={ready}
                        editable={ready}
                        style={isAddPlantFrom ? styles.inputIsAddPlantForm : styles.input}
                        placeholder={isAddPlantFrom ? "Sélectionnez la ville" : searchVille}
                    />
                    {isAddPlantFrom ? (
                        <View></View>
                    ) : (
                        <Pressable
                            style={styles.iconSearch}
                            onPress={() => {
                                search()
                            }}
                        >
                            <FaSearch />
                        </Pressable>
                    )}
                </View>
            </View>

            <View style={isAddPlantFrom ? styles.ViewXXIdAddPlantForm : styles.ViewXX}>
                {status === "OK" && (
                    <FlatList
                        data={data
                            .filter(({ types }) => types.includes("locality"))

                            .filter(
                                ({ terms }) => terms.some(obj => obj.value === "France") == true,
                            )}
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
    )
}

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
        alignItems: "left",
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
})
