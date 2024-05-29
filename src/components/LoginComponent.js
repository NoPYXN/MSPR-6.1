import React, { useState } from "react"
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from "react-native"
import { Formik } from "formik"
import * as Yup from "yup"
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import HomeScreen from "../screens/HomeScreen"

const LoginSchema = Yup.object().shape({
    // email: Yup.string().email("Adresse mail invalide").required("Champ obligatoire"),
    // password: Yup.string()
    //     .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    //     .required("Champ obligatoire"),
})

const LoginComponent = () => {
    const navigation = useNavigation()
    const [user, setUser] = useState({})
    const [error, setError] = useState(false)

    const seConnecter = async () => {
        await axios
            .post(`http://localhost:8080/api/v1/users/login`, user)
            .then(data => {
                console.log(data, "response")
                if (data.status == 200) {
                    if (data.data.auth) {
                        localStorage.setItem("token", data.data.token)
                        localStorage.setItem("pseudo", data.data.pseudo)
                        localStorage.setItem("id", data.data.id)
                        localStorage.setItem("image", data.data.image)
                        if (data.data.botanniste) {
                            localStorage.setItem("botanniste", data.data.botanniste)
                        }
                        navigation.navigate("HomeScreen")
                    }
                } else {
                    setError(true)
                }
            })
            .catch(err => {
                setError(true)
                console.log(err)
            })
    }

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={values => {
                seConnecter()
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
                            onChangeText={text => setUser({ ...user, Email: text })}
                            onBlur={handleBlur("email")}
                            // value={values.email}
                            keyboardType="email-address"
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={text => setUser({ ...user, Mdp: text })}
                            onBlur={handleBlur("password")}
                            // value={values.password}
                            secureTextEntry
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                    </View>
                    {error ? (
                        <View>
                            <Text style={{ color: "red", textAlign: "center" }}>
                                L'email ou le mot de passe est incorrect
                            </Text>
                        </View>
                    ) : (
                        <View></View>
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
    )
}

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
})

export default LoginComponent
