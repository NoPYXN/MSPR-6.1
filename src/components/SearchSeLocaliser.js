import React, { useState, useEffect } from "react"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { StyleSheet, Text, View, FlatList, TextInput, Pressable } from "react-native"

export default function Index({ setCoordonnees, coordonnees, isLoaded }) {
    if (!isLoaded) return <div>Loading...</div>
    return <Map setCoordonnees={setCoordonnees} coordonnees={coordonnees} />
}
function Map({ coordonnees, setCoordonnees }) {
    const [selected, setSelected] = useState(null)

    return (
        <View style={styles.container}>
            <View>
                <PlacesAutocomplete
                    setSelected={setSelected}
                    setCoordonnees={setCoordonnees}
                    coordonnees={coordonnees}
                />
            </View>
        </View>
    )
}

const PlacesAutocomplete = ({ setSelected, setCoordonnees, coordonnees }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete()

    const handleSelect = async address => {
        setValue(address, false)
        clearSuggestions()
        const results = await getGeocode({ address })
        const { lat, lng } = getLatLng(results[0])
        setSelected({ lat, lng })
        setCoordonnees({ ...coordonnees, localization: { lat, lng }, country: address })
    }

    return (
        <View style={styles.container}>
            <View>
                <View>
                    <TextInput
                        value={value || ""}
                        onChangeText={text => setValue(text)}
                        editable={ready}
                        style={styles.input}
                    />
                </View>
            </View>

            <View style={styles.ViewXX}>
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
        width: "100%",
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 5,
        marginTop: 10,
        marginBottom: 20,
        boxShadowColor: "#000",
        boxShadowOffset: {
            width: 0,
            height: 2,
        },
        boxShadowOpacity: 0.25,
        boxShadowRadius: 3.84,
        elevation: 5,
        width: "100%",
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
        zIndex: 1,
    },
    ViewXXIdAddPlantForm: {
        marginLeft: "2%",
    },
})
