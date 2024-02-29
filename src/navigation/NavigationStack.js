import React from "react"

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../screens/HomeScreen"
import AnnonceScreen from "../screens/AnnonceScreen"
import { NavigationContainer } from "@react-navigation/native"

const Stack = createNativeStackNavigator()

const NavigationStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="Annonce" 
                    component={AnnonceScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="HomeScreen"
                    component={HomeScreen}
                />
                {/* <Stack.Screen
                options={{ title: 'PAGE2' }}
                name="Page2" 
                component={Page2}
            /> */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationStack
