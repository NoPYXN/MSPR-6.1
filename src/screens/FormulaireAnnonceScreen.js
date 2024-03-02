import React from "react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    TextInput,
    Touchable,
} from "react-native"
import axios from "axios"
import { useNavigation, useParams, useRoute } from "@react-navigation/native"
import { AiOutlineClose } from "react-icons/ai"

import HeaderComponent from "../components/HeaderComponent"
import AddPlantForm from "../components/AddPlantForm"

const FormulaireAnnonceScreen = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <View style={styles.ViewGoBack}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate({
                            name: "HomeScreen",
                            params: { isActions: "true" },
                        })
                    }
                >
                    <View>
                        <AiOutlineClose />
                    </View>
                </TouchableOpacity>
            </View>
            <Text style={styles.TextTitre}>Ajouter une annonce</Text>
            <AddPlantForm />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    SafeAreaView: {
        width: "100%",
        backgroundColor: "white",
    },
    ViewGoBack: {
        padding: 20,
        display: "flex",
        alignItems: "flex-end",
    },
    TextTitre: {
        textAlign: "center",
        fontSize: "20px;",
    },
})
export default FormulaireAnnonceScreen
