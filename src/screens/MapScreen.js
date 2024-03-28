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
import { GoogleMap, useLoadScript, Marker, CircleF, MarkerF } from "@react-google-maps/api"
import { useNavigation, useParams, useRoute } from "@react-navigation/native"
import axios from "axios"

import HeaderComponent from "../components/HeaderComponent"
import { convertirDate } from "../utils/ConvertiDate"

export default function MapScreen() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyB8jSTHSpmqZDIl3wz5Nyz8FJfAL0bYvVE",
    })

    if (!isLoaded) return <div>Loading...</div>
    return (
        <Map
            localization={{ lat: 48.801408, lng: 2.130122 }}
            // isVisible={isVisible}
            // setIsVisible={setIsVisible}
            rayon={11}
        />
    )
}

function Map({ localization, rayon }) {
    const navigation = useNavigation()
    const [annonces, setAnnonces] = useState([])
    const [visibleMarkers, setVisibleMarkers] = useState([])
    const [hoverInfo, setHoverInfo] = useState({
        show: false,
        x: 0,
        y: 0,
        Titre: "",
        DateDebut: "",
        DateFin: "",
        Image: "",
        Id: 0,
    })

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/v1/annonces")
            .then(data => {
                if (data.status == 200) {
                    setAnnonces(data.data.content)
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        setVisibleMarkers(annonces.filter(annonce => isMarkerInRadius(annonce, rayon * 1000)))
    }, [annonces])

    useEffect(() => {
        console.log(visibleMarkers)
    }, [visibleMarkers])

    const isMarkerInRadius = (annonce, radius) => {
        const { lat: lat1, lng: lng1 } = localization
        const { lat: lat2, lng: lng2 } = { lat: annonce.Latitude, lng: annonce.Longitude }

        const earthRadius = 6371000 // Rayon moyen de la Terre en mètres

        const latDiff = (lat2 - lat1) * (Math.PI / 180)
        const lngDiff = (lng2 - lng1) * (Math.PI / 180)

        const a =
            Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(lngDiff / 2) *
                Math.sin(lngDiff / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        const distance = earthRadius * c

        return distance <= radius
    }

    const handleMouseOver = (e, Titre, DateDebut, DateFin, Image, Id) => {
        if (hoverInfo.show) {
            setHoverInfo({ ...hoverInfo, show: false })
        } else {
            const x = e.domEvent.x
            const y = e.domEvent.y
            setHoverInfo({
                show: true,
                x,
                y,
                Titre,
                DateDebut,
                DateFin,
                Image,
                Id,
            })
        }
    }

    const handleMouseLeave = () => {
        setHoverInfo({ ...hoverInfo, show: false })
    }

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <HeaderComponent navigation={navigation} />
            <View>
                <Text style={styles.titre}>
                    Retrouvez les différentes annonces dans un rayon de ?? kilomètres
                </Text>

                <GoogleMap
                    zoom={Math.log2((40075016.686 * 50) / (360 * rayon)) - 8}
                    center={localization}
                    mapContainerStyle={styles.mapcontainer}
                >
                    {localization && <CircleF center={localization} radius={rayon * 1000} />}
                    {localization && <MarkerF position={localization} />}
                    {visibleMarkers &&
                        visibleMarkers.map((v, k) => (
                            <Marker
                                key={v.Id_Annonce}
                                position={{ lat: v.Latitude, lng: v.Longitude }}
                                icon={{
                                    url: `https://openweathermap.org/img/wn/01n@2x.png`,
                                    scaledSize: new window.google.maps.Size(30, 30),
                                    anchor: new window.google.maps.Point(15, 15),
                                }}
                                label={{
                                    text: `${v.Titre}`,
                                    fontWeight: "500",
                                    style: styles.marker__label,
                                    // style: styles.marker__label,
                                }}
                                onClick={e =>
                                    handleMouseOver(
                                        e,
                                        v.Titre,
                                        v.DateDebut,
                                        v.DateFin,
                                        v.Id_Plante[0],
                                        v.Id_Annonce,
                                    )
                                }
                                //QUAND JE CLIQUE DE NOUVEAU CA RENTRE PLUS DANS LA FONCTION --> ¨PROBLEME A REGLER
                            />
                        ))}
                    {hoverInfo.show && (
                        <View>
                            {/* <Pressable
                                onPress={() => {
                                    navigation.navigate({
                                        name: "AnnonceScreen",
                                        params: { id: hoverInfo.Id },
                                    })
                                }}
                            > */}
                            <View style={styles.hoverInfoView}>
                                <Text style={styles.hoverInfoText}>{hoverInfo.Titre}</Text>
                                <Image
                                    source={{
                                        uri: `${hoverInfo.Image}`,
                                    }}
                                    alt={`image ${hoverInfo.Titre}`}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                    }}
                                />
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        width: "100%",
                                    }}
                                >
                                    <Text style={{ textAlign: "center", fontSize: "8px" }}>
                                        {convertirDate(hoverInfo.DateDebut)}
                                    </Text>
                                    <Text style={{ textAlign: "center", fontSize: "8px" }}>
                                        {convertirDate(hoverInfo.DateFin)}
                                    </Text>
                                </View>
                            </View>
                            {/* </Pressable> */}
                        </View>
                    )}
                </GoogleMap>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mapcontainer: {
        width: "100%",
        height: "500px",
        margin: "auto",
    },
    SafeAreaView: {
        width: "100%",
        backgroundColor: "white",
    },
    titre: {
        fontWeight: "bold",
        padding: "5%",
        textAlign: "center",
        fontSize: "20px",
    },
    marker__label: {
        paddingTop: "0px",
        paddingRight: "100px",
        paddingBottom: "30px",
        paddingLeft: "0px",
        // padding: "0 0 30 100",
    },
    hoverInfoView: {
        // width: "200px",
        // height: "100px",
        padding: "3%",
        width: "150px",
        backgroundColor: "white",
        borderRadius: "5px",
        borderColor: "#ccc",
        borderWidth: 2,
        marginTop: "80px",
    },
    hoverInfoText: {
        fontWeight: "bold",
        fontSize: "16px",
        textAlign: "center",
    },
})
