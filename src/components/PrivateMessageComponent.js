import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const PrivateMessageComponent = ({ setMessages, messages }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = () => {
        if (inputValue.trim() !== "") {
            const newMessage = {
                Message: inputValue,
                Username: "Current User", // Vous pouvez changer cela pour obtenir le nom d'utilisateur actuel
                DateCreation: new Date().toISOString(),
            };
            setMessages([newMessage, ...messages]); // Ajouter le message en haut
            setInputValue("");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
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
    );
};

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
});

export default PrivateMessageComponent;
