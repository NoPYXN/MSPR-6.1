import React, { useState, useEffect, Component } from "react"
import { View, Text } from "react-native"
import { useLoadScript } from "@react-google-maps/api"

import NavigationStack from "./src/navigation/NavigationStack"
import AddPlantForm from "./src/components/AddPlantForm"

const App = ({ Component }) => {
    return <NavigationStack></NavigationStack>
}

export default App
