import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, Image, SafeAreaView, Pressable } from "react-native"
import { GoogleMap, useLoadScript, Marker, CircleF, MarkerF } from "@react-google-maps/api"
import { useNavigation, useRoute } from "@react-navigation/native"
import axios from "axios"
import { AiOutlineClose } from "react-icons/ai"

import emplacement from "../assets/emplacement.png"

import HeaderComponent from "../components/HeaderComponent"

import { convertirDate } from "../utils/ConvertiDate"
import OPTIONS from "../utils/Option"

export default function MapScreen() {
    const router = useRoute()
    const [infoRoute, setInfoRoute] = useState({})
    useEffect(() => {
        setInfoRoute({ lat: router.lat, lng: router.lng, radius: router.radius })
    }, [])
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBnyp6JiXQAqF0VIfj9-cIt-OPjehWhY9E",
    })

    if (!isLoaded) return <div>Loading...</div>
    return <Map />
}

function Map() {
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
    const router = useRoute()
    const [localization, setLocalization] = useState({})
    const [rayon, setRayon] = useState()
    const [country, setCountry] = useState("")

    useEffect(() => {
        setLocalization({ lat: parseFloat(router.params.lat), lng: parseFloat(router.params.lng) })
        setRayon(router.params.radius)
        setCountry(router.params.country)
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
        console.log("hoverInfo", hoverInfo)
    }, [hoverInfo])

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
                    Retrouvez les différentes annonces dans un rayon de {rayon} kilomètres de{" "}
                    {country}
                </Text>

                <GoogleMap
                    zoom={Math.log2((40075016.686 * 50) / (360 * rayon)) - 8}
                    center={localization}
                    mapContainerStyle={styles.mapcontainer}
                    options={OPTIONS}
                >
                    {localization && (
                        <CircleF
                            center={localization}
                            radius={rayon * 1000}
                            options={{
                                fillColor: "transparent",
                                strokeColor: "gray",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                            }}
                        />
                    )}
                    {localization && (
                        <MarkerF
                            position={localization}
                            icon={{
                                url: emplacement,
                                scaledSize: new window.google.maps.Size(30, 30),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(15, 15),
                            }}
                        />
                    )}
                    {visibleMarkers &&
                        visibleMarkers.map((v, k) => (
                            <Marker
                                key={v.Id_Annonce}
                                position={{ lat: v.Latitude, lng: v.Longitude }}
                                icon={{
                                    url: `https://res.cloudinary.com/melly-lucas/image/upload/v1704971723/Arosaje/annonces/PlantMarkerMap_hyxvrt.png`,
                                    scaledSize: new window.google.maps.Size(30, 30),
                                    anchor: new window.google.maps.Point(15, 15),
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
                            />
                        ))}
                    {hoverInfo.show ? (
                        <View style={styles.containerHover}>
                            <View style={styles.hoverInfoView}>
                                <View>
                                    <Pressable
                                        onPress={() => {
                                            setHoverInfo({ ...hoverInfo, show: false })
                                        }}
                                    >
                                        <AiOutlineClose />
                                    </Pressable>

                                    <Text style={styles.hoverInfoText}>{hoverInfo.Titre}</Text>
                                    <Image
                                        source={{
                                            uri: `${hoverInfo.Image}`,
                                        }}
                                        alt={`image ${hoverInfo.Titre}`}
                                        style={{
                                            width: "200px",
                                            height: "200px",
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
                                            padding: "5%",
                                        }}
                                    >
                                        <Text style={{ textAlign: "center", fontSize: "14px" }}>
                                            {convertirDate(hoverInfo.DateDebut)}
                                        </Text>
                                        <Text style={{ textAlign: "center", fontSize: "14px" }}>
                                            {convertirDate(hoverInfo.DateFin)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : null}
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
    },
    containerHover: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    hoverInfoView: {
        padding: "5%",
        width: "300px",
        backgroundColor: "white",
        borderRadius: "5px",
        borderColor: "#ccc",
        borderWidth: 2,
    },
    hoverInfoText: {
        fontWeight: "bold",
        fontSize: "24px",
        textAlign: "center",
    },
})
