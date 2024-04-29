import React, { useState, useEffect } from "react"
import { View, ScrollView, Image, Dimensions, StyleSheet } from "react-native"

const Carousel = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0)

    const handleScroll = event => {
        const slideSize = event.nativeEvent.layoutMeasurement.width
        const index = event.nativeEvent.contentOffset.x / slideSize
        setActiveIndex(Math.round(index))
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={50}
            >
                {images.map((image, index) => (
                    <View key={index} style={styles.slide}>
                        <Image source={{ uri: image }} style={styles.image} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeIndex ? styles.activeDot : null,
                        ]}
                    />
                ))}
            </View>
        </View>
    )
}

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: windowWidth,
        height: windowHeight * 0.3,
    },
    slide: {
        width: windowWidth,
        height: windowHeight * 0.3,
    },
    image: {
        width: "100%",
        height: "100%",
        // resizeMode: "cover",
        objectFit: "cover",
        alignContent: "center",
    },
    pagination: {
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#888",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "#333",
    },
})

export default Carousel
