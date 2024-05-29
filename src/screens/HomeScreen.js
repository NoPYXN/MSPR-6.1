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
import { FaMapMarkerAlt } from "react-icons/fa"
import { useNavigation, useParams, useRoute } from "@react-navigation/native"
import { AiFillEdit, AiOutlineClose, AiFillDelete, AiOutlinePlus } from "react-icons/ai"
import { useLoadScript } from "@react-google-maps/api"

import HeaderComponent from "../components/HeaderComponent"
import ResearchBar from "../components/ResearchBar"
import SeLocaliser from "../components/SeLocaliser"

import { NumeroPage } from "../utils/NumeroPage"
import { ConvertirDateHeure } from "../utils/ConvertirDateHeure"

export default function HomeScreen() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBnyp6JiXQAqF0VIfj9-cIt-OPjehWhY9E",
        libraries: ["places"],
    })
    const [isVisiblePublication, setIsVisiblePublication] = useState(true)
    const [isVisibleGardiennage, setIsVisibleGardiennage] = useState(false)

    if (!isLoaded && isVisiblePublication) return <div>Loading...</div>
    return (
        <ListeAnnonces
            isLoaded={isLoaded}
            isVisiblePublication={isVisiblePublication}
            setIsVisiblePublication={setIsVisiblePublication}
            isVisibleGardiennage={isVisibleGardiennage}
            setIsVisibleGardiennage={setIsVisibleGardiennage}
        />
    )
}

const ListeAnnonces = ({
    isLoaded,
    isVisiblePublication,
    setIsVisiblePublication,
    isVisibleGardiennage,
    setIsVisibleGardiennage,
}) => {
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
    // const [isVisiblePublication, setIsVisiblePublication] = useState(true)
    // const [isVisibleGardiennage, setIsVisibleGardiennage] = useState(false)

    const changeUrlPagination = pageNumber => {
        pageNumber += 1
        let url = "?page=" + pageNumber
        if (searchVille) {
            url += "&ville=" + searchVille
        }
        // if (isVisible) {
        //     url += "&isActions=true"
        // }

        window.history.pushState({ page: pageNumber }, "", url)
    }

    useEffect(() => {
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
                // if (separerFiltre[i].split("=")[0] == "isActions") {
                //     isActions = true
                // }
            }
        }

        let requete = `http://localhost:8080/api/v1/annonces?page=${
            nombrePage - 1
        }&IsVisiblePublication=true`
        if (ville != "") {
            requete += `&Ville=${ville}`
        }

        NumeroPage(ville, isVisiblePublication, false, true, setAnnonces, nombrePage - 1).then(
            numero => {
                setCalculPage(numero)
            },
        )
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

    useEffect(() => {
        console.log(annonces, "annocnes")
    }, [annonces])

    // const getAnnonces = () => {
    //     axios.get(`http://localhost:8080/api/v1/annonces?page=0`).then(data => {
    //         setAnnonces(data.data.content)
    //     })
    //     setNumPage(0)
    // }
    // const supprimerAnnonce = id => {
    //     axios
    //         .delete(`http://localhost:8080/api/v1/annonces/${id}`)
    //         .then(data => {
    //             if (data.status == 200) {
    //                 setIsDelete(true)
    //                 navigation.replace("HomeScreen", { popup: "Votre annonce a été supprimée" })
    //             }
    //         })
    //         .catch(err => console.log(err))
    // }

    useEffect(() => {
        if (!showFirstView) {
            setIsDelete(false)
            setShowFirstView(true)
        }
    }, [showFirstView])

    const changePage = index => {
        let requete = `http://localhost:8080/api/v1/annonces?page=${index}&IsVisiblePublication=${isVisiblePublication}&IsVisibleGardiennage=${isVisibleGardiennage}`
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

    const goFormulaireAnnonceScreen = () => {
        if (localStorage.getItem("token")) {
            navigation.navigate({ name: "FormulaireAnnonceScreen" })
        } else {
            navigation.navigate({ name: "LoginScreen" })
        }
    }

    const showAnnoncePubliee = () => {
        setIsVisibleGardiennage(false)
        setIsVisiblePublication(true)
        console.log(searchVille, "serachville")
        NumeroPage(searchVille ? searchVille : "", true, false, true, setAnnonces, 0).then(
            numero => {
                setCalculPage(numero)
            },
            setNumPage(0),
        )
        changeUrlPagination(0)
    }

    const showGardiennage = () => {
        setIsVisibleGardiennage(true)
        setIsVisiblePublication(false)
        console.log(searchVille, "serachville")
        NumeroPage(searchVille ? searchVille : "", false, true, true, setAnnonces, 0).then(
            numero => {
                setCalculPage(numero)
            },
        )
        setNumPage(0)
        changeUrlPagination(0)
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
                                    navigation.navigate("HomeScreen")
                                    // window.history.pushState({}, "", "/")
                                    // getAnnonces()
                                    // setIsVisible(false)
                                }}
                            >
                                <AiOutlineClose />
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={() => {
                                    goFormulaireAnnonceScreen()

                                    // window.history.pushState({}, "", "?isActions=true")
                                    // getAnnonces()
                                    // setIsVisible(true)
                                }}
                            >
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <AiOutlinePlus
                                        style={{
                                            display: "flex",
                                        }}
                                    />
                                    <Text>Ajouter une annonce</Text>
                                </View>
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
                                    isVisiblePublication={isVisiblePublication}
                                    isVisibleGardiennage={isVisibleGardiennage}
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

                        {/* début de ce que j'ai rajouté */}

                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                marginTop: "5%",
                            }}
                        >
                            <Pressable
                                style={
                                    !isVisiblePublication
                                        ? {
                                              width: "50%",
                                              backgroundColor: "#f0f0f0",
                                              padding: "5%",
                                          }
                                        : { width: "50%", backgroundColor: "green", padding: "5%" }
                                }
                                onPress={() => {
                                    showAnnoncePubliee()
                                }}
                            >
                                <Text
                                    style={
                                        !isVisiblePublication
                                            ? {
                                                  textAlign: "center",
                                                  fontSize: "16px",
                                                  color: "black",
                                              }
                                            : {
                                                  textAlign: "center",
                                                  fontSize: "16px",
                                                  color: "white",
                                              }
                                    }
                                >
                                    Plantes à garder
                                </Text>
                            </Pressable>
                            <Pressable
                                style={
                                    isVisibleGardiennage
                                        ? {
                                              width: "50%",
                                              backgroundColor: "green",
                                              padding: "5%",
                                          }
                                        : {
                                              width: "50%",
                                              backgroundColor: "#f0f0f0",
                                              padding: "5%",
                                          }
                                }
                                onPress={() => {
                                    showGardiennage()
                                }}
                            >
                                <Text
                                    style={
                                        isVisibleGardiennage
                                            ? {
                                                  fontSize: "16px",
                                                  textAlign: "center",
                                                  color: "white",
                                              }
                                            : {
                                                  textAlign: "center",
                                                  fontSize: "16px",
                                                  color: "black",
                                              }
                                    }
                                >
                                    Plantes gardées
                                </Text>
                            </Pressable>
                        </View>

                        {/* fin de ce que j'ai rajouté */}

                        {isVisiblePublication ? (
                            annonces ? (
                                <View style={styles.ViewAnnonces}>
                                    {annonces.map(item =>
                                        item.Etat == false ? (
                                            <View key={item.Id_Annonce} style={styles.ViewActions}>
                                                <Pressable
                                                    onPress={() => {
                                                        navigation.navigate({
                                                            name: "AnnonceScreen",
                                                            params: { id: item.Id_Annonce },
                                                        })
                                                    }}
                                                    style={
                                                        isVisible
                                                            ? { width: "80%" }
                                                            : { width: "100%" }
                                                    }
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
                                                                {item.Titre.charAt(
                                                                    0,
                                                                ).toUpperCase() +
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
                                                                    <Text
                                                                        style={styles.dateAnnonce}
                                                                    >
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
                                            </View>
                                        ) : (
                                            <View key={item.Id_Annonce}></View>
                                        ),
                                    )}
                                </View>
                            ) : (
                                <View>
                                    <Text>Aucune annonce trouvée</Text>
                                </View>
                            )
                        ) : (
                            <View></View>
                        )}

                        {isVisibleGardiennage ? (
                            annonces ? (
                                <View style={styles.ViewAnnonces}>
                                    {annonces.map(item =>
                                        item.Etat == true ? (
                                            <View key={item.Id_Annonce} style={styles.ViewActions}>
                                                <Pressable
                                                    onPress={() => {
                                                        navigation.navigate({
                                                            name: "AnnonceScreen",
                                                            params: { id: item.Id_Annonce },
                                                        })
                                                    }}
                                                    style={
                                                        isVisible
                                                            ? { width: "80%" }
                                                            : { width: "100%" }
                                                    }
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
                                                                {item.Titre.charAt(
                                                                    0,
                                                                ).toUpperCase() +
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
                                                                    <Text
                                                                        style={styles.dateAnnonce}
                                                                    >
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
                                            </View>
                                        ) : (
                                            <View key={item.Id_Annonce}></View>
                                        ),
                                    )}
                                </View>
                            ) : (
                                <View>
                                    <Text>Aucune annonce trouvée</Text>
                                </View>
                            )
                        ) : (
                            <View></View>
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
