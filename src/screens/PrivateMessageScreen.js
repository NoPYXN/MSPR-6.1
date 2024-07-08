import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo

import PrivateMessageComponent from "../components/PrivateMessageComponent";
import { ConvertirDateHeure } from "../utils/ConvertirDateHeure";

const PrivateMessageScreen = () => {
    const [messages, setMessages] = useState([]); // Pour stocker les messages

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <View style={styles.messageContainer}>
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

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
});

export default PrivateMessageScreen;
