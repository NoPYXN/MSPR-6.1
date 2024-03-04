import React, { useState, useEffect, Component } from "react"
import { View, Text } from "react-native"
import { useLoadScript } from "@react-google-maps/api"

import NavigationStack from "./src/navigation/NavigationStack"

const App = ({ Component }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyB8jSTHSpmqZDIl3wz5Nyz8FJfAL0bYvVE",
        libraries: ["places"],
    })

    if (!isLoaded) return <div>Loading...</div>

    return <NavigationStack isLoaded={isLoaded}></NavigationStack>
}

export default App
