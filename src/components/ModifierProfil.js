import React, { useState, useEffect } from "react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    Linking,
    TextInput,
    Pressable,
} from "react-native"
import { AiOutlineClose } from "react-icons/ai"

const ModifierProfil = ({ user, setUser, setIsVisible }) => {
    const validModifierProfil = async () => {}
    return (
        <View style={styles.viewGlobale}>
            <Pressable
                onPress={() => {
                    setIsVisible(false)
                }}
            >
                <AiOutlineClose />
            </Pressable>
            <Text>Civilite</Text>
            <TextInput
                style={styles.inputField}
                onChangeText={text => setUser({ ...user, Civilite: text })}
                value={user.Civilite}
            />
            <Text>Nom</Text>
            <TextInput
                style={styles.inputField}
                onChangeText={text => setUser({ ...user, Nom: text })}
                value={user.Nom}
            />
            <Text>Prenom</Text>
            <TextInput
                style={styles.inputField}
                onChangeText={text => setUser({ ...user, Prenom: text })}
                value={user.Prenom}
            />
            <Text>Pseudo</Text>
            <TextInput
                style={styles.inputField}
                onChangeText={text => setUser({ ...user, Pseudo: text })}
                value={user.Pseudo}
            />
            <Text>Email</Text>
            <TextInput
                style={styles.inputField}
                onChangeText={text => setUser({ ...user, Email: text })}
                value={user.Email}
            />
            <Pressable
                onPress={() => {
                    validModifierProfil()
                }}
                style={styles.bottomContainer}
            >
                {" "}
                <Text style={styles.signupText}>Modifier Profil</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomContainer: {
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    inputField: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        textAlign: "center",
    },
    signupText: {
        marginTop: 20,
        color: "#5cb85c",
        textAlign: "center",
        textDecorationLine: "underline",
    },
    viewGlobale: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        alignItems: "center",
        justifyContent: "center",
        width: "70%",
        padding: "5%",
        backgroundColor: "white",
        borderRadius: "5px",
        borderColor: "black",
        borderWidth: 2,
        zIndex: 1,
    },
})

export default ModifierProfil
