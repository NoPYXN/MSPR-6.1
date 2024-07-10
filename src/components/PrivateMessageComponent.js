import React, { useState, useEffect } from "react"
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Text,
    Image,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import axios from "axios"
import { Ionicons } from "@expo/vector-icons"
import { ConvertirDateHeure } from "../utils/ConvertirDateHeure"
import { MdRefresh, MdClose } from "react-icons/md"

const PrivateMessageComponent = ({ idConversation, idUser, setIsVisible }) => {
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState([])
    const [user1, setUser1] = useState({})
    const [user2, setUser2] = useState({})

    useEffect(() => {
        axios({
            method: "get",
            url: `http://localhost:8080/api/v1/conversations/` + idConversation,
        })
            .then(data => {
                if (data.status == 200) {
                    const tabMessages = data.data.content.Messages
                    tabMessages.sort((a, b) => new Date(b.DateCreation) - new Date(a.DateCreation))
                    setMessages(tabMessages)
                    setUser1(data.data.content.user1)
                    setUser2(data.data.content.user2)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        console.log(messages, "messages")
    }, [messages])

    const handleSubmit = async () => {
        await axios({
            method: "post",
            url: `http://localhost:8080/api/v1/messages/`,
            data: {
                text: inputValue,
                conversationId: idConversation,
                userId: parseInt(idUser),
            },
        })
            .then(data => {
                if (data.status == 201) {
                    setInputValue("")
                }
                // console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
        actualiser()
    }

    const actualiser = async () => {
        await axios({
            method: "get",
            url: `http://localhost:8080/api/v1/conversations/` + idConversation,
        })
            .then(data => {
                if (data.status == 200) {
                    const tabMessages = data.data.content.Messages
                    tabMessages.sort((a, b) => new Date(b.DateCreation) - new Date(a.DateCreation))
                    setMessages(tabMessages)
                    setUser1(data.data.content.user1)
                    setUser2(data.data.content.user2)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    // useEffect(() => {
    //     console.log(user1, "USER1")
    // }, [user1])

    return (
        <View style={{ width: "100%", height: "100%", paddingTop: "5%" }}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: "3%",
                    paddingRight: "3%",
                    paddingLeft: "3%",
                }}
            >
                <Pressable
                    onPress={() => {
                        setIsVisible(false)
                    }}
                >
                    <MdClose />
                </Pressable>
                <Pressable onPress={() => actualiser()}>
                    <MdRefresh />
                </Pressable>
            </View>
            <View style={styles.messageContainer}>
                {messages ? (
                    <FlatList
                        data={messages}
                        renderItem={({ item, index }) => (
                            <View key={index} style={styles.message}>
                                <View style={styles.infosMessage}>
                                    <View style={styles.avatarContainer}>
                                        {item.userId == user1.Id_Utilisateur ? (
                                            <View style={{ flex: "display", flexDirection: "row" }}>
                                                {user1 && user1.Image ? (
                                                    <Image
                                                        style={styles.imageConversation}
                                                        source={{
                                                            uri: user1.Image,
                                                        }}
                                                    />
                                                ) : (
                                                    <Ionicons
                                                        name="person-circle-outline"
                                                        size={24}
                                                        color="black"
                                                    />
                                                )}
                                                {user1 && user1.Pseudo ? (
                                                    <Text style={styles.pseudo}>
                                                        {user1.Pseudo}
                                                    </Text>
                                                ) : (
                                                    <Text style={styles.pseudo}>Anonyme</Text>
                                                )}
                                            </View>
                                        ) : (
                                            <View style={{ flex: "display", flexDirection: "row" }}>
                                                {user2 && user2.Image ? (
                                                    <Image
                                                        style={styles.imageConversation}
                                                        source={{
                                                            uri: user2.Image,
                                                        }}
                                                    />
                                                ) : (
                                                    <Ionicons
                                                        name="person-circle-outline"
                                                        size={24}
                                                        color="black"
                                                    />
                                                )}
                                                {user2 && user2.Pseudo ? (
                                                    <Text style={styles.pseudo}>
                                                        {user2.Pseudo}
                                                    </Text>
                                                ) : (
                                                    <Text style={styles.pseudo}>Anonyme</Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.messageTime}>
                                        {ConvertirDateHeure(item.DateCreation)}
                                    </Text>
                                </View>
                                <View style={styles.messageContent}>
                                    <Text style={styles.messageText}>{item.text}</Text>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        inverted
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
                    />
                ) : (
                    <View></View>
                )}
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.container}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setInputValue}
                        value={inputValue}
                        placeholder="Saisissez vos indications ici"
                        multiline={true}
                        numberOfLines={4}
                    />
                    <Pressable style={styles.sendButton} onPress={handleSubmit}>
                        <View style={styles.sendButtonContent}>
                            <FontAwesome name="send" size={20} color="white" />
                        </View>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        margin: 10,
        padding: 5,
        backgroundColor: "white",
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    textInput: {
        flex: 1,
        padding: 10,
    },
    sendButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: "green",
        marginLeft: 10,
    },
    sendButtonContent: {
        justifyContent: "center",
        alignItems: "center",
    },
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
    imageConversation: {
        width: 24,
        height: 24,
        borderRadius: 50,
    },
})

export default PrivateMessageComponent
