import React, { useState, useEffect, Component } from "react"
import { View, Text } from "react-native"
import { useLoadScript } from "@react-google-maps/api"

import NavigationStack from "./src/navigation/NavigationStack"

const App = () => {
    return <NavigationStack></NavigationStack>
}

export default App
