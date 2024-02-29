import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from "react-native"
import axios from "axios"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { FaMapMarkerAlt } from "react-icons/fa"
import { useNavigation, useParams } from "@react-navigation/native"
import { AiFillEdit, AiOutlineClose, AiFillDelete } from "react-icons/ai"

import HeaderComponent from "../components/HeaderComponent"
import ResearchBar from "../components/ResearchBar"
//PROCHIANEMENT VOIR POUR LE MESSAGE DE SUPPRESSION LE PASSER DANS LE RELOAD ET RESTER SUR LA MEME PAGE ET EN MODE MODIFIER QUAND ON FAIT LE RELOZD
const HomeScreen = () => {
    const [annonces, setAnnonces] = useState([])
    const [showFirstView, setShowFirstView] = useState(true)
    const [calculPage, setCalculPage] = useState(0)
    const [pageChoisie, setPageChoisie] = useState()
    const [searchVille, setSearchVille] = useState()
    const [coordonnees, setCoordonnees] = useState()
    const [selected, setSelected] = useState()
    const [isVisible, setIsVisible] = useState()
    const [isDelete, setIsDelete] = useState()
    const [isReload, setIsReload] = useState()
    const navigation = useNavigation()

    useEffect(() => {
        console.log(navigation)
        setIsDelete(false)
        axios
            .get(`http://localhost:8080/api/v1/annonces`)
            .then(data => {
                if (data.status == 200) {
                    setCalculPage(Math.ceil(data.data.content.length / 5))
                }
            })
            .catch(err => console.log(err))
        axios
            .get(`http://localhost:8080/api/v1/annonces?page=${pageChoisie ? pageChoisie : 0}`)
            .then(data => {
                if (data.status == 200) {
                    setIsVisible(false)
                    setAnnonces(data.data.content)
                }
            })
            .catch(err => console.log(err))
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

    const supprimerAnnonce = id => {
        axios
            .delete(`http://localhost:8080/api/v1/annonces/${id}`)
            .then(data => {
                if (data.status == 200) {
                    setIsDelete(true)
                    navigation.replace("HomeScreen", { pageChoisie, isVisible })
                }
            })
            .catch(err => console.log(err))
        const timer = setTimeout(() => {
            setShowFirstView(false)
        }, 2000)

        return () => clearTimeout(timer)
    }

    useEffect(() => {
        if (!showFirstView) {
            setIsDelete(false)
            setShowFirstView(true)
        }
    }, [showFirstView])

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
            <HeaderComponent navigation={navigation} />

            {isDelete && showFirstView ? (
                <View style={styles.ViewMessage}>
                    <Text style={styles.textMessage}>Votre annonce a été supprimée</Text>
                </View>
            ) : (
                <View></View>
            )}
            <View style={styles.ViewGlobale}>
                <View style={styles.ViewLocalisation}>
                    {!isVisible ? (
                        <View style={styles.ViewSelocaliser}>
                            <Text>Se localiser </Text>
                            <View>
                                <FaMapMarkerAlt />
                            </View>
                        </View>
                    ) : (
                        <View></View>
                    )}

                    {isVisible ? (
                        <TouchableOpacity
                            onPress={() => {
                                setIsVisible(false)
                            }}
                        >
                            <AiOutlineClose />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                setIsVisible(true)
                            }}
                        >
                            <AiFillEdit />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={isVisible ? "" : styles.ViewSearchAnnonces}>
                    {!isVisible ? (
                        <View>
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
                        </View>
                    ) : (
                        <View></View>
                    )}

                    {/* <AutoComplete /> */}
                    {annonces ? (
                        <View style={styles.ViewAnnonces}>
                            {annonces.map(item => (
                                <View key={item.Id_Annonce} style={styles.ViewActions}>
                                    <View
                                        style={
                                            isVisible
                                                ? styles.ViewAnnonceAvecActions
                                                : styles.ViewAnnonce
                                        }
                                    >
                                        <Image
                                            style={
                                                isVisible
                                                    ? styles.imageAnnonceAvecActions
                                                    : styles.imageAnnonce
                                            }
                                            source={{
                                                uri: item.Id_Plante[0],
                                            }}
                                        />

                                        <View style={styles.infoAnnonce}>
                                            <Text
                                                style={
                                                    isVisible
                                                        ? styles.titreAnnonceAvecActions
                                                        : styles.titreAnnonce
                                                }
                                            >
                                                {item.Titre}
                                            </Text>
                                            <Text
                                                style={
                                                    isVisible
                                                        ? styles.villeAnnonceAvecActions
                                                        : styles.villeAnnonce
                                                }
                                            >
                                                {item.Ville}
                                            </Text>
                                            {!isVisible ? (
                                                <View>
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
                                            ) : (
                                                <View></View>
                                            )}
                                        </View>
                                    </View>
                                    {isVisible ? (
                                        <View style={styles.BoutonsActions}>
                                            <TouchableOpacity onPress={() => {}}>
                                                <AiFillEdit size={20} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    supprimerAnnonce(item.Id_Annonce)
                                                }}
                                            >
                                                <AiFillDelete size={20} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View></View>
                                    )}
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
    imageAnnonceAvecActions: {
        width: 80,
        height: 80,
        borderRadius: 100,
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
    ViewAnnonceAvecActions: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        width: "80%",
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
    titreAnnonceAvecActions: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    villeAnnonce: {
        fontSize: 14,
        color: "#29771D",
        fontWeight: "bold",
        marginBottom: 5,
    },
    villeAnnonceAvecActions: {
        fontSize: 12,
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
        justifyContent: "space-between",
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
    ViewSelocaliser: {
        display: "flex",
        flexDirection: "row",
    },
    ViewActions: {
        display: "flex",
        flexDirection: "row",
    },
    BoutonsActions: {
        width: "15%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ViewMessage: {
        width: "100%",
        height: "30px",
        backgroundColor: "black",
    },
    textMessage: {
        color: "green",
        textAlign: "center",
        marginTop: "auto",
        marginBottom: "auto",
    },
})

export default HomeScreen
