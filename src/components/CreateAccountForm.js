import React, { useState } from "react";
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

const Checkbox = ({ label, value, onPress }) => {
    return (
        <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
            <View style={[styles.checkbox, { backgroundColor: value ? "#5cb85c" : "#fff" }]} />
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const CreateAccountForm = () => {
    const [user, setUser] = useState({
        Civilite: "",
        Nom: "",
        Prenom: "",
        Email: "",
        Mdp: "",
        Adresse: "",
    });

    const selectGender = (gender) => {
        setUser({ ...user, Civilite: gender });
    };

    return (
        <Formik
            initialValues={user}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
                // Logique de soumission du formulaire
                console.log(values);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formContainer}>

                    <Text style={styles.label}>Civilité</Text>
                    <View style={styles.checkboxGroup}>
                        <Checkbox label="Homme" value={user.Civilite === "homme"} onPress={() => selectGender("homme")} />
                        <Checkbox label="Femme" value={user.Civilite === "femme"} onPress={() => selectGender("femme")} />
                        <Checkbox label="Autre" value={user.Civilite === "autre"} onPress={() => selectGender("autre")} />
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
                    <View style={styles.buttonContainer}>
                        <Button onPress={handleSubmit} title="Valider" color="#5cb85c" />
                    </View>
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
        alignItems: 'center',
        padding: 20,
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
    checkboxText: {
        color: "#fff",
        fontSize: 16,
    },
    checkboxLabel: {
        fontSize: 16,
    },
});

export default CreateAccountForm;
