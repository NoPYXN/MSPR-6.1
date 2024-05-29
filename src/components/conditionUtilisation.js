import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

import HeaderComponent from "../components/HeaderComponent"

const ConditionGeneralUtilisation = ({ setIsVisibleConseilUtilisation }) => {
    const router = useRoute()
    const [id, setId] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setId(router.params?.id)
    }, [router.params])

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Bienvenue sur l'application Arosaje</Text>
                <Text style={styles.paragraph}>
                    En utilisant notre application, vous acceptez les présentes conditions générales
                    d'utilisation. Merci de les lire attentivement.
                </Text>

                <Text style={styles.sectionTitle}>Collecte et Utilisation des Données</Text>
                <Text style={styles.subTitle}>Données Collectées :</Text>
                <Text style={styles.listItem}>• Civilité</Text>
                <Text style={styles.listItem}>• Nom</Text>
                <Text style={styles.listItem}>• Prénom</Text>
                <Text style={styles.listItem}>• Pseudo</Text>
                <Text style={styles.listItem}>• Email</Text>
                <Text style={styles.listItem}>• Mot de passe</Text>
                <Text style={styles.listItem}>• Coordonnées</Text>
                <Text style={styles.listItem}>• Localisation</Text>
                <Text style={styles.listItem}>• Pays</Text>

                <Text style={styles.subTitle}>Utilisation des Données :</Text>
                <Text style={styles.paragraph}>
                    Les données collectées sont utilisées uniquement dans le cadre de l'application
                    Arosaje. Les données permettent de personnaliser votre expérience utilisateur,
                    d'améliorer nos services et de vous fournir les fonctionnalités essentielles de
                    l'application.
                </Text>

                <Text style={styles.sectionTitle}>Conservation et Suppression des Données</Text>
                <Text style={styles.subTitle}>Durée de Conservation :</Text>
                <Text style={styles.paragraph}>
                    Vos données sont conservées pendant une durée de deux ans à compter de votre
                    dernière activité sur l'application.
                </Text>

                <Text style={styles.subTitle}>Suppression sur Demande :</Text>
                <Text style={styles.paragraph}>
                    Vous pouvez demander la suppression de vos données à tout moment. Pour ce faire,
                    contactez-nous via ArosajeSupport@gmail.com.
                </Text>

                <Text style={styles.sectionTitle}>Sécurité des Données</Text>
                <Text style={styles.subTitle}>Mesures de Sécurité :</Text>
                <Text style={styles.paragraph}>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                    pour protéger vos données personnelles contre la perte, le vol et l'accès non
                    autorisé.
                </Text>

                <Text style={styles.subTitle}>Accès Limité :</Text>
                <Text style={styles.paragraph}>
                    L'accès à vos données est strictement limité au personnel autorisé de notre
                    entreprise qui a besoin de ces informations pour exécuter leurs tâches.
                </Text>

                <Text style={styles.sectionTitle}>Droits des Utilisateurs</Text>
                <Text style={styles.subTitle}>Accès et Rectification :</Text>
                <Text style={styles.paragraph}>
                    Vous avez le droit d'accéder à vos données personnelles et de demander leur
                    rectification en cas d'erreur.
                </Text>

                <Text style={styles.subTitle}>Portabilité :</Text>
                <Text style={styles.paragraph}>
                    Vous avez le droit de recevoir vos données personnelles dans un format structuré
                    et couramment utilisé.
                </Text>

                <Text style={styles.subTitle}>Opposition et Limitation :</Text>
                <Text style={styles.paragraph}>
                    Vous pouvez vous opposer à l'utilisation de vos données personnelles et demander
                    une limitation de leur traitement.
                </Text>

                <Text style={styles.sectionTitle}>Cookies et Traceurs</Text>
                <Text style={styles.subTitle}>Utilisation des Cookies :</Text>
                <Text style={styles.paragraph}>
                    Nous utilisons des cookies pour améliorer votre expérience sur notre
                    application. Vous pouvez gérer vos préférences en matière de cookies à tout
                    moment via les paramètres de votre navigateur.
                </Text>

                <Text style={styles.sectionTitle}>Modifications des Conditions Générales</Text>
                <Text style={styles.subTitle}>Mises à Jour :</Text>
                <Text style={styles.paragraph}>
                    Nous nous réservons le droit de modifier ces conditions générales d'utilisation
                    à tout moment. Toute modification sera publiée sur cette page et, si les
                    changements sont significatifs, vous en serez informé par email.
                </Text>

                <Text style={styles.sectionTitle}>Contact</Text>
                <Text style={styles.paragraph}>
                    Coordonnées : Pour toute question ou demande concernant vos données
                    personnelles, veuillez nous contacter à ArosajeSupport@gmail.com.
                </Text>

                <Text style={styles.thankYou}>Merci d'utiliser Arosaje! :)))</Text>
                <Pressable
                    style={{
                        width: "30%",
                        padding: "2%",
                        backgroundColor: "green",
                        borderRadius: "10px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "5%",
                    }}
                    onPress={() => {
                        setIsVisibleConseilUtilisation(false)
                    }}
                >
                    <Text style={{ color: "white", textAlign: "center" }}>Retour</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollView: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 12,
        textAlign: "justify",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
    },
    listItem: {
        fontSize: 16,
        marginLeft: 16,
        marginBottom: 4,
    },
    thankYou: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 24,
    },
})

export default ConditionGeneralUtilisation
