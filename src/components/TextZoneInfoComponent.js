import React, { useState } from "react"
import { View, TextInput, StyleSheet, Pressable } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import axios from "axios"

const TextZoneInfo = ({ setMessages, messages }) => {
    const [inputValue, setInputValue] = useState("")

    const handleSubmit = async () => {
        console.log("dans fonction")
        if (inputValue.trim() !== "") {
            console.log("dans if")
            await axios
                .post(`http://localhost:8080/api/v1/conseils`, {
                    Message: inputValue,
                    ConseilId: 51,
                })
                .then(data => {
                    if (data.status == 201) {
                        console.log(data)
                        setMessages([...messages, data.data.content])
                        setInputValue("")
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                onChangeText={setInputValue}
                value={inputValue}
                placeholder="Saisissez vos indications ici"
                multiline={true}
                numberOfLines={4}
            />
            <Pressable style={styles.sendButton} onPress={() => handleSubmit()}>
                <View style={styles.sendButtonContent}>
                    <FontAwesome name="send" size={20} color="white" />
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // width: "100%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        // marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    textInput: {
        height: 50,
        flex: 1,
        padding: 10,
    },
    sendButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: "green",
        marginLeft: 10,
        marginRight: 10,
    },
    sendButtonContent: {
        justifyContent: "center",
        alignItems: "center",
    },
})

export default TextZoneInfo
