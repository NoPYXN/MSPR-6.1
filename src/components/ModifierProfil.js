import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";

const Checkbox = ({ label, value, onPress }) => {
    return (
        <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
            <View style={[styles.checkbox, { backgroundColor: value ? "#5cb85c" : "#fff" }]} />
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const ModifierProfil = ({ user, setUser, setIsVisible }) => {
    const validModifierProfil = async () => {
        await axios
            .put("http://localhost:8080/api/v1/users/" + localStorage.getItem("id"), user)
            .then(data => setIsVisible(false))
            .catch(err => console.log(err));
    };

    const selectGender = gender => {
        setUser({ ...user, Civilite: gender });
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.viewGlobale}>
                <Pressable
                    onPress={() => {
                        setIsVisible(false);
                    }}
                    style={styles.closeButton}
                >
                    <AiOutlineClose size={24} />
                </Pressable>
                <Text style={styles.label}>Civilité</Text>
                <View style={styles.checkboxGroup}>
                    <Checkbox
                        label="Homme"
                        value={user.Civilite === "homme"}
                        onPress={() => selectGender("homme")}
                    />
                    <Checkbox
                        label="Femme"
                        value={user.Civilite === "femme"}
                        onPress={() => selectGender("femme")}
                    />
                    <Checkbox
                        label="Autre"
                        value={user.Civilite === "autre"}
                        onPress={() => selectGender("autre")}
                    />
                </View>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={text => setUser({ ...user, Nom: text })}
                    value={user.Nom}
                />
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={text => setUser({ ...user, Prenom: text })}
                    value={user.Prenom}
                />
                <Text style={styles.label}>Pseudo</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={text => setUser({ ...user, Pseudo: text })}
                    value={user.Pseudo}
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={text => setUser({ ...user, Email: text })}
                    value={user.Email}
                />
                <Pressable
                    onPress={validModifierProfil}
                    style={styles.modifyButton}
                >
                    <Text style={styles.modifyButtonText}>Modifier Profil</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
    },
    closeButton: {
        alignSelf: "flex-end",
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
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
        fontSize: 16,
        width: "100%",
    },
    modifyButton: {
        backgroundColor: "#5cb85c",
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        width: "100%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modifyButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    viewGlobale: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    checkboxGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#5cb85c",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5,
    },
    checkboxLabel: {
        fontSize: 16,
    },
});

export default ModifierProfil;
