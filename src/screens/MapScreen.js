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
            rayon={20}
        />
    )
}

function Map({ localization, rayon }) {
    const navigation = useNavigation()
    const [annonces, setAnnonces] = useState([])
    const [hoverInfo, setHoverInfo] = useState({
        show: false,
        x: 0,
        y: 0,
        Titre: "",
        DateDebut: "",
        DateFin: "",
        Image: "",
    })

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/v1/annonces")
            .then(data => {
                if (data.status == 200) {
                    // console.log(data.data)
                    // data.data.content.DateDebut = convertirDate(data.data.content.DateDebut)
                    // data.data.content.DateFin = convertirDate(data.data.content.DateFin)
                    setAnnonces(data.data.content)
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        console.log(annonces, "ANNONCES")
    }, [annonces])

    const handleMouseOver = (e, Titre, DateDebut, DateFin, Image) => {
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
        })
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
                    {localization && <MarkerF position={{ lat: 48.900002, lng: 2.08333 }} />}
                    {annonces &&
                        annonces.map((v, k) => (
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
                                // onMouseUp={e => console.log(e)}

                                onMouseOver={e =>
                                    handleMouseOver(
                                        e,
                                        v.Titre,
                                        v.DateDebut,
                                        v.DateFin,
                                        v.Id_Plante[0],
                                    )
                                } //
                                onMouseOut={handleMouseLeave}
                            />
                        ))}
                    {hoverInfo.show && (
                        <View
                        // style={{
                        //     left: hoverInfo.x,
                        //     top: hoverInfo.y,
                        // }}
                        // className={styles.overlay}
                        >
                            <View style={styles.hoverInfoView}>
                                <Text style={styles.hoverInfoText}>{hoverInfo.Titre}</Text>
                                <View
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignContent: "space-between",
                                    }}
                                >
                                    <Text>{convertirDate(hoverInfo.DateDebut)}</Text>
                                    <Text>{convertirDate(hoverInfo.DateFin)}</Text>
                                </View>
                                <Image
                                    source={{
                                        uri: `${hoverInfo.Image}`,
                                    }}
                                    // url="https://res.cloudinary.com/melly-lucas/image/uploa…9574976/Arosaje/annonces/gofappi0fi6jempcagqr.jpg"
                                    alt={`image ${hoverInfo.Titre}`}
                                    style={{ width: "100px", height: "100px" }}
                                />
                            </View>
                            {/* <div className={styles.overlay__container}>
                                        <img
                                            src={`https://openweathermap.org/img/wn/${hoverInfo.icon}@4x.png`}
                                            alt="Green double couch with wooden legs"
                                            width={60}
                                            height={60}
                                        />
                                        <div className={styles.ovelay__temp}>{hoverInfo.temperature}°</div>
                                    </div>
                                    <div>{weatherDescription(hoverInfo.icon)}</div> */}
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
        width: "200px",
        height: "200px",
        backgroundColor: "white",
        borderRadius: "5px",
    },
    hoverInfoText: {
        fontWeight: "bold",
        fontSize: "16px",
        textAlign: "center",
    },
})
