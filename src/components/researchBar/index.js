import React, { useState, useContext } from "react"

import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { useLoadScript } from "@react-google-maps/api"

import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
} from "react-native"
import { FaSearch } from "react-icons/fa"

import axios from "axios"

export default function Index({
    setSearchVille,
    setCoordonnees,
    setSelected,
    searchVille,
    setCalculPage,
    setAnnonces,
    pageChoisie,
    selected,
}) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyB8jSTHSpmqZDIl3wz5Nyz8FJfAL0bYvVE",
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
}) {
    return (
        <div>
            <div>
                <PlacesAutocomplete
                    setSearchVille={setSearchVille}
                    setSelected={setSelected}
                    setCoordonnees={setCoordonnees}
                    searchVille={searchVille}
                    setCalculPage={setCalculPage}
                    setAnnonces={setAnnonces}
                    pageChoisie={pageChoisie}
                    selected={selected}
                />
            </div>
        </div>
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

    const handleSelect = async address => {
        console.log(address)
        setValue(address, false)
        clearSuggestions()
        const results = await getGeocode({ address })
        const { lat, lng } = getLatLng(results[0])
        setSearchVille(address.split(",")[0])
        setCoordonnees({ lat: lat, lng: lng })
        setSelected(true)
        setCountryChoice(address.split(",")[0])
    }

    const search = () => {
        if (selected) {
            axios
                .get(
                    `http://localhost:8080/api/v1/annonces?page=${pageChoisie}&Ville=${countryChoice}`,
                )
                .then(data => {
                    if (data.status == 200) {
                        console.log(data.data.content)

                        setCalculPage(Math.ceil(data.data.content.length / 4))
                        setAnnonces(data.data.content)
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.divInput}>
                    <TextInput
                        value={value ?? ""}
                        onChangeText={text => setValue(text)}
                        editable={ready}
                        style={{
                            flex: 1,
                            // paddingRight: 40,
                            width: "50%",
                            padding: 8,
                            borderWidth: 2,
                            borderColor: "#ccc",
                            borderRadius: 5,
                            fontSize: 16,
                        }}
                    />

                    <TouchableOpacity
                        style={styles.iconSearch}
                        onPress={() => {
                            search()
                        }}
                    >
                        <FaSearch />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.ViewXX}>
                {status === "OK" && (
                    <FlatList
                        data={data}
                        keyExtractor={item => item.place_id}
                        renderItem={({ item }) => (
                            <View style={styles.ViewFlatList}>
                                <TouchableOpacity
                                    onPress={() => handleSelect(item.description)}
                                    style={styles.listItem}
                                >
                                    <Text>{item.description}</Text>
                                </TouchableOpacity>
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
        padding: 5,
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
})
