import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from "react-native"
import axios from "axios"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { FaMapMarkerAlt } from "react-icons/fa"

import Header from "../components/Header"
import ResearchBar from "../components/ResearchBar"

const HomeScreen = () => {
    const [annonces, setAnnonces] = useState([])
    const [showFirstView, setShowFirstView] = useState(true)
    const [calculPage, setCalculPage] = useState(0)
    const [pageChoisie, setPageChoisie] = useState(0)
    const [searchVille, setSearchVille] = useState()
    const [coordonnees, setCoordonnees] = useState()
    const [selected, setSelected] = useState()

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/annonces?page=${pageChoisie}`)
            .then(data => {
                if (data.status == 200) {
                    console.log(data.data.content)

                    setCalculPage(Math.ceil(data.data.content.length / 4))
                    setAnnonces(data.data.content)
                }
            })
            .catch(err => console.log(err))
        const timer = setTimeout(() => {
            setShowFirstView(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    const boutons = Array.from({ length: calculPage }, (_, index) => (
        <View style={styles.ViewButton} key={index}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    changePage(index)
                }}
            >
                <Text>{index + 1}</Text>
            </TouchableOpacity>
        </View>
    ))

    const changePage = index => {
        let requete = `http://localhost:8080/api/v1/annonces?page=${index}`
        if (searchVille) {
            requete += `&Ville=${searchVille}`
        }
        axios
            .get(requete)
            .then(data => {
                if (data.status == 200) {
                    setAnnonces(data.data.content)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <Header />
            {/* <View style={styles.ViewHeader}>
                <TouchableOpacity onPress={() => {}} />
            </View> */}
            {showFirstView ? (
                <View style={styles.container}>
                    <Header
                        onMenuPress={() => console.log("Menu Pressed")}
                        onProfilePress={() => console.log("Profile Pressed")}
                    />
                </View>
            ) : (
                <View style={styles.ViewGlobale}>
                    <View style={styles.ViewLocalisation}>
                        <Text>Se localiser </Text>
                        <View>
                            <FaMapMarkerAlt />
                        </View>
                    </View>
                    <View style={styles.ViewSearchAnnonces}>
                        <Text style={styles.SearchVille}>Chercher une ville</Text>
                        <ResearchBar
                            setCoordonnees={setCoordonnees}
                            setSearchVille={setSearchVille}
                            setSelected={setSelected}
                            selected={selected}
                            setCalculPage={setCalculPage}
                            setAnnonces={setAnnonces}
                            pageChoisie={pageChoisie}
                        />
                        {/* <AutoComplete /> */}
                        {annonces ? (
                            <View style={styles.ViewAnnonces}>
                                {annonces.map(item => (
                                    <View key={item.Id_Annonce} style={styles.ViewAnnonce}>
                                        <Image
                                            style={styles.imageAnnonce}
                                            source={{
                                                uri: item.Id_Plante[0],
                                            }}
                                        />
                                        <View style={styles.infoAnnonce}>
                                            <Text style={styles.titreAnnonce}>{item.Titre}</Text>
                                            <Text style={styles.villeAnnonce}>{item.Ville}</Text>
                                            <Text style={styles.dateAnnonce}>
                                                Depuis le{" "}
                                                {format(
                                                    parseISO(item.DateCreation),
                                                    "EEEE dd MMMM yyyy",
                                                    {
                                                        locale: fr,
                                                    },
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View>Aucune annonce trouvée</View>
                        )}
                    </View>

                    <View style={styles.ViewButtons}>
                        {annonces && annonces.length > 0 ? boutons : <Text>Pas d'annonces</Text>}
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    welcomeText: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    SafeAreaView: {
        width: "100%",
    },
    ViewGlobale: {
        margin: "5%",
    },
    SearchVille: {
        textAlign: "center",
        marginBottom: "2%",
    },
    imageAnnonce: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    ViewSearchAnnonces: {
        marginTop: "7%",
    },
    ViewAnnonce: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        width: "100%",
    },
    ViewAnnonces: {
        flexDirection: "column",
        width: "90%",
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "7%",
    },
    infoAnnonce: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: "5%",
        flex: 1,
    },
    titreAnnonce: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    villeAnnonce: {
        fontSize: 14,
        color: "#29771D",
        fontWeight: "bold",
        marginBottom: 5,
    },
    dateAnnonce: {
        fontSize: 10,
        color: "#757575",
        textAlign: "right",
    },
    ViewLocalisation: {
        display: "flex",
        flexDirection: "row",
    },
    ViewHeader: {
        width: "100%",
        height: "10%",
        backgroundColor: "#29771D",
    },
    ViewButtons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    ViewButton: {
        margin: "5%",
    },
})

export default HomeScreen
