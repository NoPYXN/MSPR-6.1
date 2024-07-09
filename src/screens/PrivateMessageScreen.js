import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, Pressable } from "react-native"
import axios from "axios"

import PrivateMessageComponent from "../components/PrivateMessageComponent"
import { useNavigation, useRoute } from "@react-navigation/native"
import HeaderComponent from "../components/HeaderComponent"

const PrivateMessageScreen = () => {
    // const [messages, setMessages] = useState([])
    const [user, setUser] = useState({})
    const router = useRoute()
    const navigation = useNavigation()
    const [conversations, setConversations] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [idConversation, setIdConversation] = useState()

    useEffect(() => {
        // console.log("Test profil screen")
        axios({
            method: "get",
            url: "http://localhost:8080/api/v1/users/" + localStorage.getItem("id"),
            headers: { Authorization: localStorage.getItem("token") },
        })
            .then(data => {
                const tableauConversations1 = data.data.content.conversations1
                const tableauConversations2 = data.data.content.conversations2
                const mergedTabs = tableauConversations2.reduce(
                    (acc, val) => acc.concat(val),
                    tableauConversations1,
                )
                mergedTabs.sort((a, b) => new Date(b.DateCreation) - new Date(a.DateCreation))
                setConversations(mergedTabs)
                console.log(data)
            })
            .catch(err => {
                console.log(err, "err")
                navigation.navigate({ name: "LoginScreen" })
            })
    }, [router.params])

    useEffect(() => {
        console.log(conversations, "CONVERSATIONS")
    }, [conversations])

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => {
                setIsVisible(true)
                setIdConversation(item.Id_Conversation)
            }}
        >
            <View style={styles.ViewConversation}>
                <Image
                    style={styles.imageConversation}
                    source={{
                        uri: item.user2.Image,
                    }}
                />
                <View style={styles.sousViewConversation}>
                    <Text style={styles.pseudoPrioprietaire}>
                        {item.user2.Pseudo.charAt(0).toUpperCase() + item.user2.Pseudo.slice(1)}{" "}
                        pour{" "}
                        {item.annonce.Titre.charAt(0).toUpperCase() + item.annonce.Titre.slice(1)}
                    </Text>
                    <Text style={styles.dateConversation}>
                        {new Date(item.DateCreation).toLocaleString()}
                    </Text>
                </View>
            </View>
        </Pressable>
    )

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            {/* <View style={styles.containerView}> */}
            {isVisible ? (
                <View style={{ width: "100%", height: "80%", paddingBottom: "5%" }}>
                    <PrivateMessageComponent
                        // conversations={conversations}
                        idConversation={idConversation}
                        // IdUser={localStorage.getItem("id")}
                    />
                </View>
            ) : (
                <View>
                    {conversations && conversations.length != 0 ? (
                        <FlatList
                            data={conversations}
                            renderItem={renderItem}
                            keyExtractor={item => item.Id_Conversation}
                        />
                    ) : (
                        <View>
                            <Text style={styles.noMessages}>Vous n'avez pas de messages</Text>
                        </View>
                    )}
                </View>
            )}
            {/* </View> */}
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
    ViewConversation: {
        flexDirection: "row",
        width: "90%",
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "7%",
        borderWidth: "1px",
        borderColor: "grey",
        borderRadius: "5px",
        padding: "3%",
        display: "flex",
    },
    sousViewConversation: {
        paddingRight: "5%",
        width: "90%",
    },
    imageConversation: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    pseudoPrioprietaire: {
        fontSize: "18px",
        width: "100%",
        height: "100%",
        // textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    dateConversation: {
        fontSize: 10,
        color: "#757575",
        textAlign: "right",
    },
})

export default PrivateMessageScreen
