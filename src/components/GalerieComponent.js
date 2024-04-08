import React from "react"
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native"

const windowWidth = Dimensions.get("window").width

const Galerie = ({ images }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    image: {
        width: windowWidth * 0.3, // 25% de la largeur de l'écran
        height: windowWidth * 0.3, // Même hauteur que la largeur pour une image carrée
        margin: windowWidth * 0.01, // Marge de 1% de la largeur de l'écran entre les images
        resizeMode: "cover",
    },
})

export default Galerie
