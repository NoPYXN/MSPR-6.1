import React, { useState } from "react"
import { View, ScrollView, Image, Dimensions, StyleSheet } from "react-native"

const Carousel = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const { width: windowWidth } = Dimensions.get("window")

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
                scrollEventThrottle={200}
            >
                {images
                    ? images.map((image, index) => (
                          <Image key={index} source={{ uri: image }} style={styles.image} />
                      ))
                    : ""}
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

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    image: {
        width: Dimensions.get("window").width,
        height: 200,
        // resizeMode: "cover",
        objectFit: "scale-down",
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
