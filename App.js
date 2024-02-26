import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, Image } from "react-native"
import Header from "./src/components/header"
import axios from "axios"

const App = () => {
    const [annonces, setAnnonces] = useState([])

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/v1/annonces")
            .then(data => {
                if (data.status == 200) {
                    console.log(data.data.content)
                    setAnnonces(data.data.content)
                }
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <View>
            {annonces.map(element => (
                <View key={element.Id_Annonce}>
                    <Image
                        style={styles.imageAnnonce}
                        source={{
                            uri: element.Id_Plante[0],
                        }}
                    />
                    <Text>{element.Titre}</Text>
                    <Text>{element.Ville}</Text>
                    <Text>Annonce postée le {element.DateCreation}</Text>
                </View>
            ))}
        </View>
        // <View style={styles.container}>
        //   <Header
        //     onMenuPress={() => console.log('Menu Pressed')}
        //     onProfilePress={() => console.log('Profile Pressed')}
        //   />
        // </View>
    )
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     welcomeText: {
//         fontSize: 20,
//         textAlign: "center",
//         margin: 10,
//     },
// })

const styles = StyleSheet.create({
    imageAnnonce: {
        width: 50,
        height: 50,
    },
})

export default App
