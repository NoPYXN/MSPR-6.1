import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import SearchSeLocaliser from "./SearchSeLocaliser";
import axios from "axios";

const SignupSchema = Yup.object().shape({
    // nom: Yup.string().required("Champ obligatoire"),
    // prenom: Yup.string().required("Champ obligatoire"),
    // pseudo: Yup.string().required("Champ obligatoire"),
    // email: Yup.string().email("Adresse mail invalide").required("Champ obligatoire"),
    // password: Yup.string()
    //     .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    //     .required("Champ obligatoire"),
    // // confirmPassword: Yup.string()
    // //     .oneOf([Yup.ref("password"), null], "Les mots de passe doivent correspondre")
    // //     .required("Champ obligatoire"),
    // adresse: Yup.string().required("Champ obligatoire"),
});

const Checkbox = ({ label, value, onPress }) => {
    return (
        <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
            <View style={[styles.checkbox, { backgroundColor: value ? "#5cb85c" : "#fff" }]} />
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const CreateAccountForm = ({ navigation }) => {
    const [user, setUser] = useState({
        Civilite: "",
        Nom: "",
        Prenom: "",
        Pseudo: "",
        Email: "",
        Mdp: "",
        Longitude: "",
        Latitude: "",
        Ville: "",
    });
    const [coordonnees, setCoordonnees] = useState({});
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [termsAccepted, settermsAccepted] = useState(false);

    const selectGender = (gender) => {
        setUser({ ...user, Civilite: gender });
    };

    const handleSubmit = async () => {
        if (
            !user.Civilite ||
            !user.Nom ||
            !user.Prenom ||
            !user.Pseudo ||
            !user.Email ||
            !user.Mdp ||
            !coordonnees.localization ||
            !coordonnees.country ||
            !termsAccepted
        ) {
            setError(true);
            setMessage("Tous les champs sont obligatoires");
        } else {
            setError(false);
            setMessage("");
            await axios
                .post(`http://localhost:8080/api/v1/users/register`, {
                    ...user,
                    Latitude: coordonnees.localization.lat,
                    Longitude: coordonnees.localization.lng,
                    Ville: coordonnees.country,
                })
                .then((data) => {
                    if (data.status == 200) {
                        if (data.data.register == false) {
                            setError(true);
                            setMessage(data.data.message);
                        }
                    }
                    if (data.status == 201) {
                        if (data.data.register) {
                            navigation.replace("LoginScreen", {
                                popup: "Votre compte a bien été ajouté",
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <Formik
            initialValues={user}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
                handleSubmit();
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formContainer}>
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

                    {/* Nom */}
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setUser({ ...user, Nom: text })}
                        onBlur={handleBlur("Nom")}
                    />
                    {touched.Nom && errors.Nom && <Text>{errors.Nom}</Text>}

                    {/* Prénom */}
                    <Text style={styles.label}>Prénom</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setUser({ ...user, Prenom: text })}
                        onBlur={handleBlur("Prenom")}
                    />
                    {touched.Prenom && errors.Prenom && <Text>{errors.Prenom}</Text>}

                    {/* Pseudo */}
                    <Text style={styles.label}>Pseudo</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setUser({ ...user, Pseudo: text })}
                        onBlur={handleBlur("Pseudo")}
                    />
                    {touched.Pseudo && errors.Pseudo && <Text>{errors.Pseudo}</Text>}

                    {/* Adresse mail */}
                    <Text style={styles.label}>Adresse mail</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setUser({ ...user, Email: text })}
                        onBlur={handleBlur("Email")}
                        keyboardType="email-address"
                    />
                    {touched.Email && errors.Email && <Text>{errors.Email}</Text>}

                    {/* Mot de passe */}
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setUser({ ...user, Mdp: text })}
                        onBlur={handleBlur("password")}
                        secureTextEntry
                    />
                    {touched.password && errors.password && <Text>{errors.password}</Text>}

                    {/* Adresse postale */}
                    <Text style={styles.label}>Adresse postale</Text>
                    <SearchSeLocaliser
                        setCoordonnees={setCoordonnees}
                        coordonnees={coordonnees}
                    />
                    {touched.Adresse && errors.Adresse && <Text>{errors.Adresse}</Text>}

                    {/* Case à cocher pour accepter les conditions d'utilisation */}
                    <View style={styles.checkboxContainer}>
                        <Pressable
                            style={styles.checkboxContainer}
                            value={termsAccepted}
                            onPress={() => settermsAccepted(!termsAccepted)}
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    { backgroundColor: termsAccepted ? "#5cb85c" : "#fff" },
                                ]}
                            />
                            <Text style={styles.checkboxLabel}>Accepter les </Text>
                            <Pressable
                                onPress={() => {
                                    navigation.navigate({
                                        name: "ConditionGeneralUtilisation",
                                    });
                                }}
                            >
                                <Text style={styles.linkText}>conditions d'utilisation</Text>
                            </Pressable>
                        </Pressable>
                        {touched.termsAccepted && errors.termsAccepted && (
                            <Text style={{ color: "red" }}>{errors.termsAccepted}</Text>
                        )}
                    </View>

                    {/* Bouton de soumission */}
                    <View style={styles.buttonContainer}>
                        <Button onPress={handleSubmit} title="Valider" color="#5cb85c" />
                    </View>
                    {error ? (
                        <View>
                            <Text style={{ color: "red" }}>{message}</Text>
                        </View>
                    ) : (
                        <View></View>
                    )}
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
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
    buttonContainer: {
        marginTop: 20,
    },
    linkText: {
        fontSize: 16,
        color: "#551A8B",
        textDecorationLine: "underline",
    },
});

export default CreateAccountForm;