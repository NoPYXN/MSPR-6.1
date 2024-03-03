import React, { useState, useEffect, useRef } from "react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    TextInput,
    Touchable,
} from "react-native"
import axios from "axios"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { FaMapMarkerAlt } from "react-icons/fa"
import { useNavigation, useParams, useRoute } from "@react-navigation/native"
import { AiFillEdit, AiOutlineClose, AiFillDelete } from "react-icons/ai"

import HeaderComponent from "../components/HeaderComponent"
import ResearchBar from "../components/ResearchBar"
import { NumeroPage } from "../utils/NumeroPage"

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
    const navigation = useNavigation()
    const [numPage, setNumPage] = useState(0)
    const route = useRoute()
    // if (route.params) {
    //     const { isAnnonceDelete } = route.params
    // }

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
        console.log(route, "ROUTE")
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

        // setIsDelete(false)

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
        if (route.params?.isAnnonceDelete) {
            setIsDelete(true)
            delete route.params.isAnnonceDelete

            navigation.navigate({
                name: "HomeScreen",
                params: { isActions: "true" },
            })
            const timer = setTimeout(() => {
                setShowFirstView(false)
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [])

    const boutons = Array.from({ length: calculPage }, (_, index) => (
        <View style={styles.ViewButton} key={index}>
            <TouchableOpacity
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
            </TouchableOpacity>
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
                    navigation.replace("HomeScreen", { isAnnonceDelete: "ok" })
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
                                window.history.pushState({}, "", "/")
                                getAnnonces()
                                setIsVisible(false)
                            }}
                        >
                            <AiOutlineClose />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                window.history.pushState({}, "", "?isActions=true")
                                getAnnonces()
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
                                searchVille={searchVille}
                                setSelected={setSelected}
                                selected={selected}
                                setCalculPage={setCalculPage}
                                setAnnonces={setAnnonces}
                                pageChoisie={pageChoisie}
                            />
                        </View>
                    ) : (
                        <View style={styles.BoutonAjouterAnnonce}>
                            <TouchableOpacity
                                onPress={() => {
                                    window.history.pushState({}, "", "/FormulaireAnnonceScreen")
                                    navigation.navigate("FormulaireAnnonceScreen")
                                }}
                            >
                                <Text style={styles.TextAjouterAnnonce}>Créer une annonce</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {annonces ? (
                        <View style={styles.ViewAnnonces}>
                            {annonces.map(item => (
                                <View key={item.Id_Annonce} style={styles.ViewActions}>
                                    <TouchableOpacity
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
                                    </TouchableOpacity>
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
        backgroundColor: "white",
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

export default HomeScreen
