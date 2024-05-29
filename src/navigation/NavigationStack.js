import React, { useEffect } from "react"
import { Text } from "react-native"

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "../screens/HomeScreen"
import FormulaireAnnonceScreen from "../screens/FormulaireAnnonceScreen"
import AnnonceScreen from "../screens/AnnonceScreen"
import MapScreen from "../screens/MapScreen"
import CreateAccount from "../screens/CreateAccount"
import LoginScreen from "../screens/LoginScreen"
import ProfilScreen from "../screens/ProfilScreen"
import DemandeBotaniste from "../screens/DemandeBotaniste"
import ConditionGeneralUtilisation from "../screens/ConditionGeneralUtilisation"

const Stack = createNativeStackNavigator()

const config = {
    screens: {
        HomeScreen: "",
        FormulaireAnnonceScreen: "FormulaireAnnonceScreen",
    },
}

const linking = {
    prefixes: ["http://localhost:19006"],
    config,
}

const NavigationStack = isLoaded => {
    return (
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
            <Stack.Navigator>
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="HomeScreen"
                    component={HomeScreen}
                    isLoaded={isLoaded}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="FormulaireAnnonceScreen"
                    component={FormulaireAnnonceScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="AnnonceScreen"
                    component={AnnonceScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="MapScreen"
                    component={MapScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="CreateAccount"
                    component={CreateAccount}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="LoginScreen"
                    component={LoginScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="ProfilScreen"
                    component={ProfilScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="DemandeBotaniste"
                    component={DemandeBotaniste}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="ConditionGeneralUtilisation"
                    component={ConditionGeneralUtilisation}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationStack
