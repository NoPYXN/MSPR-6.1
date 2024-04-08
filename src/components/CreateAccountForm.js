import React from "react"
import { View, TextInput, Button, Text, StyleSheet } from "react-native"
import { Formik } from "formik"
import * as Yup from "yup"

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
    phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, "Doit être uniquement des chiffres")
        .required("Champ obligatoire"),
    adresse: Yup.string().required("Champ obligatoire"),
})

const CreateAccountForm = () => (
    <Formik
        initialValues={{
            nom: "",
            prenom: "",
            email: "",
            password: "",
            // confirmPassword: '',
            phoneNumber: "",
            adresse: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={values => console.log(values)}
    >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={handleChange("nom")}
                    onBlur={handleBlur("nom")}
                    value={values.nom}
                />
                {touched.nom && errors.nom && <Text>{errors.nom}</Text>}
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={handleChange("prenom")}
                    onBlur={handleBlur("prenom")}
                    value={values.prenom}
                />
                {touched.prenom && errors.prenom && <Text>{errors.prenom}</Text>}
                <Text style={styles.label}>Adresse mail</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                />
                {touched.email && errors.email && <Text>{errors.email}</Text>}
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                />
                {touched.password && errors.password && <Text>{errors.password}</Text>}
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
                <Text style={styles.label}>N° de téléphone</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    keyboardType="phone-pad"
                />
                {touched.phoneNumber && errors.phoneNumber && <Text>{errors.phoneNumber}</Text>}
                <Text style={styles.label}>Adresse postal</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={handleChange("adresse")}
                    onBlur={handleBlur("adresse")}
                    value={values.adresse}
                />
                {touched.adresse && errors.adresse && <Text>{errors.adresse}</Text>}
                <Button onPress={handleSubmit} title="Valider" color="#5cb85c" />
            </View>
        )}
    </Formik>
)

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        backgroundColor: "#fff", // ou toute autre couleur de fond que vous préférez
        padding: 20,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    inputField: {
        backgroundColor: "#fff", // Assurez-vous que c'est la même que le fond pour l'effet désiré
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10, // Coins arrondis pour les champs de texte
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // pour Android
    },
    button: {
        borderRadius: 20,
        padding: 15,
        backgroundColor: "#5cb85c", // ou toute autre couleur que vous préférez pour le bouton
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    // Ajoutez des styles pour les icônes et les messages d'erreur si nécessaire
})

export default CreateAccountForm
