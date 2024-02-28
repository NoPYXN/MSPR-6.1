import React from "react"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"

const GooglePlacesInput = () => {
    return (
        <GooglePlacesAutocomplete
            placeholder="Entrez une adresse"
            onPress={(data, details = null) => {
                // 'details' est fourni lorsque fetchDetails = true
                console.log(data, details)
            }}
            query={{
                key: "AIzaSyB8jSTHSpmqZDIl3wz5Nyz8FJfAL0bYvVE",
                language: "fr",
                types: "address", // pour obtenir uniquement les adresses
            }}
        />
    )
}

export default GooglePlacesInput
