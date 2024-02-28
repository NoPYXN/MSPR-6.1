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
import { FiEye, FiEyeOff } from "react-icons/fi"
import { FaSearch } from "react-icons/fa"

import axios from "axios"

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox"
import "@reach/combobox/styles.css"

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
    // const [selected, setSelected] = useState<any>(false)
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
            console.log(
                "req",
                `http://localhost:8080/api/v1/annonces?page=${pageChoisie}&Ville=${countryChoice}`,
            )
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
        <Combobox onSelect={handleSelect}>
            <View style={styles.container}>
                <View style={styles.divInput}>
                    <ComboboxInput
                        id="comboboxInput"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        disabled={!ready}
                        // placeholder="Rechercher une ville ...."
                        style={{
                            flex: 1,
                            // paddingRight: 40,
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

                    <ComboboxPopover>
                        <ComboboxList>
                            {status === "OK" &&
                                data
                                    .filter(({ types }) => types.includes("locality"))

                                    .filter(
                                        ({ terms }) =>
                                            terms.some(obj => obj.value === "France") == true,
                                    )

                                    .map(({ place_id, description }) => (
                                        <ComboboxOption key={place_id} value={description} />
                                    ))}
                        </ComboboxList>
                    </ComboboxPopover>
                </View>
            </View>
        </Combobox>
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
})
