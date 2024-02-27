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

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox"
import "@reach/combobox/styles.css"

export default function Index({ setSearchVille, setCoordonnees, setSelected }) {
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
        />
    )
}
function Map({ setSearchVille, setCoordonnees, setSelected }) {
    // const [selected, setSelected] = useState<any>(false)
    return (
        <div>
            <div>
                <PlacesAutocomplete
                    setSearchVille={setSearchVille}
                    setSelected={setSelected}
                    setCoordonnees={setCoordonnees}
                />
            </div>
        </div>
    )
}

const PlacesAutocomplete = ({ setSelected, setSearchVille, setCoordonnees }) => {
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

    const handleSelect = async address => {
        console.log(address)
        setValue(address, false)
        clearSuggestions()
        const results = await getGeocode({ address })
        const { lat, lng } = getLatLng(results[0])
        setSearchVille(address.split(",")[0])
        setCoordonnees({ lat: lat, lng: lng })
        setSelected(true)
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
                    <TouchableOpacity style={styles.iconSearch} onPress={() => {}}>
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
