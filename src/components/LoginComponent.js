import React, { useState } from "react";
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Schéma de validation pour Formik
const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Adresse mail invalide").required("Champ obligatoire"),
    password: Yup.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .required("Champ obligatoire"),
});

const LoginComponent = () => {
    const navigation = useNavigation();
    const [error, setError] = useState(false);

    const seConnecter = async (values) => {
        try {
            // Afficher le message de tentative de connexion
            console.log("Attempting to connect to:", `http://localhost:8080/api/v1/users/login`);
            const response = await axios.post(`http://localhost:8080/api/v1/users/login`, {
                Email: values.email,
                Mdp: values.password,
            });

            const data = response.data;
            console.log("Response:", data);

            if (response.status === 200 && data.auth) {
                // Stocker les données utilisateur dans AsyncStorage
                await AsyncStorage.setItem("token", data.token);
                await AsyncStorage.setItem("pseudo", data.pseudo);
                await AsyncStorage.setItem("id", data.id.toString());
                await AsyncStorage.setItem("image", data.image);
                if (data.botanniste) {
                    await AsyncStorage.setItem("botanniste", data.botanniste.toString());
                }
                // Naviguer vers l'écran d'accueil
                navigation.navigate("HomeScreen");
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
            console.log("Error:", err);
        }
    };

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
                seConnecter(values);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Adresse mail</Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            value={values.email}
                            keyboardType="email-address"
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            value={values.password}
                            secureTextEntry
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                    </View>
                    {error && (
                        <View>
                            <Text style={{ color: "red", textAlign: "center" }}>
                                L'email ou le mot de passe est incorrect
                            </Text>
                        </View>
                    )}
                    <View style={styles.bottomContainer}>
                        <Button onPress={handleSubmit} title="Valider" color="#5cb85c" />
                        <Pressable onPress={() => navigation.navigate("CreateAccount")}>
                            <Text style={styles.signupText}>Créer un compte</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
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
    errorText: {
        color: "red",
        marginBottom: 20,
        textAlign: "center",
    },
    bottomContainer: {
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    signupText: {
        marginTop: 20,
        color: "#5cb85c",
        textAlign: "center",
        textDecorationLine: "underline",
    },
});

export default LoginComponent;
