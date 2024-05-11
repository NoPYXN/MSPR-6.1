import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
    nom: Yup.string().required("Champ obligatoire"),
    prenom: Yup.string().required("Champ obligatoire"),
    email: Yup.string().email("Adresse mail invalide").required("Champ obligatoire"),
    password: Yup.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .required("Champ obligatoire"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Les mots de passe doivent correspondre")
        .required("Champ obligatoire"),
    adresse: Yup.string().required("Champ obligatoire"),
});

const CreateAccountForm = () => {
    const [user, setUser] = useState({
        Civilite: "",
        Nom: "",
        Prenom: "",
        Email: "",
        Mdp: "",
        Adresse: "",
    });

    // Effet secondaire pour afficher les valeurs de user dans la console lorsque user est modifié
    useEffect(() => {
        console.log(user);
    }, [user]);

    const handleSubmitForm = () => {
        console.log("Informations de l'utilisateur :", user);
    };

    return (
        <Formik
            initialValues={user}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
                // Logique de soumission du formulaire
                handleSubmitForm();
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formContainer}>

                    {/* Civilité */}
                    <Text style={styles.label}>Civilité</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setUser({ ...user, Civilite: "homme" })}
                        >
                            <View style={[styles.radioCircle, { backgroundColor: values.Civilite === "homme" ? "#5cb85c" : "#ccc" }]} />
                            <Text style={styles.radioText}>Homme</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setUser({ ...user, Civilite: "femme" })}
                        >
                            <View style={[styles.radioCircle, { backgroundColor: values.Civilite === "femme" ? "#5cb85c" : "#ccc" }]} />
                            <Text style={styles.radioText}>Femme</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setUser({ ...user, Civilite: "autre" })}
                        >
                            <View style={[styles.radioCircle, { backgroundColor: values.Civilite === "autre" ? "#5cb85c" : "#ccc" }]} />
                            <Text style={styles.radioText}>Autre</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Nom */}
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange("Nom")}
                        onBlur={handleBlur("Nom")}
                        value={values.Nom}
                    />
                    {touched.Nom && errors.Nom && <Text>{errors.Nom}</Text>}
                    
                    {/* Prénom */}
                    <Text style={styles.label}>Prénom</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange("Prenom")}
                        onBlur={handleBlur("Prenom")}
                        value={values.Prenom}
                    />
                    {touched.Prenom && errors.Prenom && <Text>{errors.Prenom}</Text>}
                    
                    {/* Adresse mail */}
                    <Text style={styles.label}>Adresse mail</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange("Email")}
                        onBlur={handleBlur("Email")}
                        value={values.Email}
                        keyboardType="email-address"
                    />
                    {touched.Email && errors.Email && <Text>{errors.Email}</Text>}
                    
                    {/* Mot de passe */}
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        secureTextEntry
                    />
                    {touched.password && errors.password && <Text>{errors.password}</Text>}

                    {/* Confirmation du mot de passe */}
                    <Text style={styles.label}>Comfirmation du mot de passe</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                        secureTextEntry
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                        <Text>{errors.confirmPassword}</Text>
                    )}
                    
                    {/* Adresse postale */}
                    <Text style={styles.label}>Adresse postale</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange("Adresse")}
                        onBlur={handleBlur("Adresse")}
                        value={values.Adresse}
                    />
                    {touched.Adresse && errors.Adresse && <Text>{errors.Adresse}</Text>}
                    
                    {/* Bouton de soumission */}
                    <Button onPress={handleSubmit} title="Valider" color="#5cb85c" />
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
        boxShadowColor: "#000",
        boxShadowOffset: {
            width: 0,
            height: 2,
        },
        boxShadowOpacity: 0.25,
        boxShadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 15,
        backgroundColor: "#5cb85c",
        alignItems: "center",
    },
    radioContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#5cb85c",
        marginRight: 10,
    },
    radioText: {
        fontSize: 16,
    },
});

export default CreateAccountForm;
