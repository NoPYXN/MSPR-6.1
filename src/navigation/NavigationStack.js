import React from "react"

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../screens/HomeScreen"
import { NavigationContainer } from "@react-navigation/native"

const Stack = createNativeStackNavigator()

const NavigationStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="HomeScreen"
                    component={HomeScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationStack
