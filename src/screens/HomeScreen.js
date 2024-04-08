import React, { useState, useEffect, useRef } from "react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    Linking,
    TextInput,
    Pressable,
} from "react-native"
import axios from "axios"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { FaMapMarkerAlt } from "react-icons/fa"
import { useNavigation, useParams, useRoute } from "@react-navigation/native"
import { AiFillEdit, AiOutlineClose, AiFillDelete } from "react-icons/ai"
import { useLoadScript } from "@react-google-maps/api"

import HeaderComponent from "../components/HeaderComponent"
import ResearchBar from "../components/ResearchBar"
import SeLocaliser from "../components/SeLocaliser"

import { NumeroPage } from "../utils/NumeroPage"
import { ConvertirDateHeure } from "../utils/ConvertirDateHeure"

export default function HomeScreen() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBnyp6JiXQAqF0VIfj9-cIt-OPjehWhY9E", //"AIzaSyDbr6FgqPsctO5kXmIFoYL7X7TuaXAGX_o",
        libraries: ["places"],
    })

    if (!isLoaded) return <div>Loading...</div>
    return <ListeAnnonces isLoaded={isLoaded} />
}

const ListeAnnonces = ({ isLoaded }) => {
    const [annonces, setAnnonces] = useState([])
    const [showFirstView, setShowFirstView] = useState(true)
    const [calculPage, setCalculPage] = useState(0)
    const [pageChoisie, setPageChoisie] = useState()
    const [searchVille, setSearchVille] = useState()
    const [coordonnees, setCoordonnees] = useState()
    const [localization, setLocalization] = useState()
    const [selected, setSelected] = useState()
    const [isVisible, setIsVisible] = useState()
    const [isDelete, setIsDelete] = useState()
    const navigation = useNavigation()
    const [numPage, setNumPage] = useState(0)
    const route = useRoute()
    const [message, setMessage] = useState(route.params?.popup || "")
    const [isVisibleLocalisation, setIsVisibleLocalisation] = useState(false)

    const changeUrlPagination = pageNumber => {
        pageNumber += 1
        let url = "?page=" + pageNumber
        if (searchVille) {
            url += "&ville=" + searchVille
        }
        if (isVisible) {
            url += "&isActions=true"
        }

        window.history.pushState({ page: pageNumber }, "", url)
    }

    useEffect(() => {
        // console.log(loaded, "LOADED")
        let urlParam = ""
        let nombrePage = 1
        let separerFiltre = ""
        let ville = ""
        let isActions = false
        if (window.location?.search) {
            urlParam = window.location.search.split("?")[1]
            separerFiltre = urlParam.split("&")
            for (let i = 0; i < separerFiltre.length; i++) {
                if (separerFiltre[i].split("=")[0] == "page") {
                    nombrePage = separerFiltre[i].split("=")[1]
                    setNumPage(parseInt(nombrePage) - 1)
                }
                if (separerFiltre[i].split("=")[0] == "ville") {
                    ville = separerFiltre[i].split("=")[1]
                    setSearchVille(ville)
                }
                if (separerFiltre[i].split("=")[0] == "isActions") {
                    isActions = true
                }
            }
        }

        let requete = `http://localhost:8080/api/v1/annonces?page=${nombrePage - 1}`
        if (ville != "") {
            requete += `&Ville=${ville}`
        }

        NumeroPage(ville).then(numero => {
            setCalculPage(numero)
        })
        axios
            .get(requete)
            .then(data => {
                if (data.status == 200) {
                    if (isActions) {
                        setIsVisible(true)
                    } else {
                        setIsVisible(false)
                    }
                    setAnnonces(data.data.content)
                }
            })
            .catch(err => console.log(err))
        if (route.params?.popup) {
            setIsDelete(true)
            delete route.params.popup

            navigation.navigate({
                name: "HomeScreen",
            })
            const timer = setTimeout(() => {
                setShowFirstView(false)
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [])

    const boutons = Array.from({ length: calculPage }, (_, index) => (
        <View style={styles.ViewButton} key={index}>
            <Pressable
                style={styles.button}
                onPress={() => {
                    changePage(index)
                }}
            >
                {parseInt(numPage) == parseInt(index) ? (
                    <Text style={styles.NumeroPageGras}>{index + 1}</Text>
                ) : (
                    <Text>{index + 1}</Text>
                )}
            </Pressable>
        </View>
    ))

    const getAnnonces = () => {
        axios.get(`http://localhost:8080/api/v1/annonces?page=0`).then(data => {
            setAnnonces(data.data.content)
        })
        setNumPage(0)
    }
    const supprimerAnnonce = id => {
        axios
            .delete(`http://localhost:8080/api/v1/annonces/${id}`)
            .then(data => {
                if (data.status == 200) {
                    setIsDelete(true)
                    navigation.replace("HomeScreen", { popup: "Votre annonce a été supprimée" })
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (!showFirstView) {
            setIsDelete(false)
            setShowFirstView(true)
        }
    }, [showFirstView])

    const changePage = index => {
        console.log(searchVille, "searchville")
        let requete = `http://localhost:8080/api/v1/annonces?page=${index}`
        if (searchVille) {
            requete += `&Ville=${searchVille}`
        }
        axios
            .get(requete)
            .then(data => {
                if (data.status == 200) {
                    setAnnonces(data.data.content)
                    changeUrlPagination(index)
                    setNumPage(index)
                }
            })
            .catch(err => console.log(err))
    }

    const modifierAnnonce = id => {
        navigation.navigate("FormulaireAnnonceScreen", { id: id })
    }

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />

            {isDelete && showFirstView ? (
                <View style={styles.ViewMessage}>
                    <Text style={styles.textMessage}>{message}</Text>
                </View>
            ) : (
                <View></View>
            )}
            <View style={{ position: "relative" }}>
                {isVisibleLocalisation ? (
                    <SeLocaliser
                        setIsVisibleLocalisation={setIsVisibleLocalisation}
                        navigation={navigation}
                        localization={localization}
                        setLocalization={setLocalization}
                        isLoaded={isLoaded}
                    />
                ) : (
                    <View></View>
                )}
                <View
                    style={isVisibleLocalisation ? styles.ViewGlobaleOpacity : styles.ViewGlobale}
                >
                    <View style={styles.ViewLocalisation}>
                        {!isVisible ? (
                            <Pressable
                                onPress={() => {
                                    setIsVisibleLocalisation(true)
                                }}
                            >
                                <View style={styles.ViewSelocaliser}>
                                    <Text>Se localiser </Text>
                                    <View>
                                        <FaMapMarkerAlt />
                                    </View>
                                </View>
                            </Pressable>
                        ) : (
                            <View></View>
                        )}

                        {isVisible ? (
                            <Pressable
                                onPress={() => {
                                    window.history.pushState({}, "", "/")
                                    getAnnonces()
                                    setIsVisible(false)
                                }}
                            >
                                <AiOutlineClose />
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={() => {
                                    window.history.pushState({}, "", "?isActions=true")
                                    getAnnonces()
                                    setIsVisible(true)
                                }}
                            >
                                <AiFillEdit />
                            </Pressable>
                        )}
                    </View>
                    <View style={isVisible ? "" : styles.ViewSearchAnnonces}>
                        {!isVisible ? (
                            <View>
                                <Text style={styles.SearchVille}>Chercher une ville</Text>

                                <ResearchBar
                                    setCoordonnees={setCoordonnees}
                                    setSearchVille={setSearchVille}
                                    searchVille={searchVille}
                                    setSelected={setSelected}
                                    selected={selected}
                                    setCalculPage={setCalculPage}
                                    setAnnonces={setAnnonces}
                                    pageChoisie={pageChoisie}
                                    isLoaded={isLoaded}
                                />
                            </View>
                        ) : (
                            <View style={styles.BoutonAjouterAnnonce}>
                                <Pressable
                                    onPress={() => {
                                        window.history.pushState({}, "", "/FormulaireAnnonceScreen")
                                        navigation.navigate("FormulaireAnnonceScreen")
                                    }}
                                >
                                    <Text style={styles.TextAjouterAnnonce}>Créer une annonce</Text>
                                </Pressable>
                            </View>
                        )}

                        {annonces ? (
                            <View style={styles.ViewAnnonces}>
                                {annonces.map(item => (
                                    <View key={item.Id_Annonce} style={styles.ViewActions}>
                                        <Pressable
                                            onPress={() => {
                                                navigation.navigate({
                                                    name: "AnnonceScreen",
                                                    params: { id: item.Id_Annonce },
                                                })
                                            }}
                                            style={isVisible ? { width: "80%" } : { width: "100%" }}
                                        >
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
                                                        {item.Titre.charAt(0).toUpperCase() +
                                                            item.Titre.slice(1)}
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
                                                                {ConvertirDateHeure(
                                                                    item.DateCreation,
                                                                )}
                                                            </Text>
                                                        </View>
                                                    ) : (
                                                        <View></View>
                                                    )}
                                                </View>
                                            </View>
                                        </Pressable>
                                        {isVisible ? (
                                            <View style={styles.BoutonsActions}>
                                                <Pressable
                                                    onPress={() => {
                                                        modifierAnnonce(item.Id_Annonce)
                                                    }}
                                                >
                                                    <AiFillEdit size={20} />
                                                </Pressable>
                                                <Pressable
                                                    onPress={() => {
                                                        supprimerAnnonce(item.Id_Annonce)
                                                    }}
                                                >
                                                    <AiFillDelete size={20} />
                                                </Pressable>
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
        backgroundColor: "white",
    },
    ViewGlobale: {
        margin: "5%",
    },
    ViewGlobaleOpacity: {
        margin: "5%",
        opacity: "0.2",
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
    NumeroPageGras: {
        fontWeight: "bold",
    },
    BoutonAjouterAnnonce: {
        backgroundColor: "green",
        borderRadius: 5,
        padding: 10,
        width: "45%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "5%",
    },
    TextAjouterAnnonce: {
        color: "white",
        textAlign: "center",
    },
})
