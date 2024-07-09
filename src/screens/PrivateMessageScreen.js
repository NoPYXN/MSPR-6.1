import React, { useState, useEffect } from "react"
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons" // Import Ionicons from expo
import axios from "axios"

import PrivateMessageComponent from "../components/PrivateMessageComponent"
import { ConvertirDateHeure } from "../utils/ConvertirDateHeure"
import { useNavigation, useRoute } from "@react-navigation/native"
import HeaderComponent from "../components/HeaderComponent"

const PrivateMessageScreen = () => {
    const [messages, setMessages] = useState([]) // Pour stocker les messages
    const [user, setUser] = useState({})
    const router = useRoute()
    const navigation = useNavigation()
    const [conversations, setConversations] = useState([])

    useEffect(() => {
        console.log("Test profil screen")
        axios({
            method: "get",
            url: "http://localhost:8080/api/v1/users/" + localStorage.getItem("id"),
            headers: { Authorization: localStorage.getItem("token") },
        })
            .then(data => {
                // setConversations(data.data.content.conversations1) + conversation 2 il faut un tableau des deux
                console.log(data.data.content)
            })
            .catch(err => {
                console.log(err, "err")
                navigation.navigate({ name: "LoginScreen" })
            })
    }, [router.params])

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            {conversations && conversations.length != 0 ? (
                <FlatList
                    data={conversations}
                    renderItem={({ item, index }) => <View key={index}></View>}
                    keyExtractor={(item, index) => index.toString()}
                    inverted
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
                />
            ) : (
                <View>
                    <Text style={styles.noMessages}>Vous n'avez pas de messages</Text>
                </View>
            )}

            {/* <View style={styles.messageContainer}>
                <FlatList
                    data={messages}
                    renderItem={({ item, index }) => (
                        <View key={index} style={styles.message}>
                            <View style={styles.infosMessage}>
                                <View style={styles.avatarContainer}>
                                    <Ionicons
                                        name="person-circle-outline"
                                        size={24}
                                        color="black"
                                    />
                                    <Text style={styles.pseudo}>{item.Username}</Text>
                                </View>
                                <Text style={styles.messageTime}>
                                    {ConvertirDateHeure(item.DateCreation)}
                                </Text>
                            </View>
                            <View style={styles.messageContent}>
                                <Text style={styles.messageText}>{item.Message}</Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    inverted
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
                <PrivateMessageComponent
                    messages={messages}
                    setMessages={setMessages}
                />
            </KeyboardAvoidingView> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    SafeAreaView: {
        flex: 1,
        backgroundColor: "white",
    },
    messageContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    message: {
        flexDirection: "column",
        marginBottom: 10,
    },
    infosMessage: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
    },
    pseudo: {
        marginLeft: 5,
        fontWeight: "bold",
    },
    messageContent: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
    },
    messageText: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        color: "#888",
    },
    TextIndication: {
        paddingTop: 10,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
    },
    separateur: {
        height: "1px",
        backgroundColor: "black",
        marginHorizontal: "6%",
    },
    noMessages: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: "5%",
    },
})

export default PrivateMessageScreen
