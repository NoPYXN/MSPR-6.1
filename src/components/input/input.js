import React, { useState } from "react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
} from "react-native"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { FaSearch } from "react-icons/fa"

const Input = ({ label, type, value, placeholder, required, onChange, style }) => {
    const [hide, setHide] = useState(true)

    const hidePass = e => {
        e.preventDefault()
        if (hide) {
            document.getElementById(label ?? "")?.setAttribute("type", "text")
            setHide(false)
        } else {
            document.getElementById(label ?? "")?.setAttribute("type", "password")
            setHide(true)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.divInput}>
                <TextInput
                    type={type}
                    id={label}
                    value={value}
                    onChangeText={onChange}
                    style={[styles.input, style]}
                />
                {type === "search" && (
                    <TouchableOpacity style={styles.iconSearch}>
                        <FaSearch />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        flex: 1,
        padding: 5,
        borderWidth: 2,
        borderColor: "#ccc",
        borderRadius: 5,
        fontSize: 16,
    },
    divInput: {
        flexDirection: "row",
        alignItems: "center",
        width: "60%",
        position: "relative",
    },
    iconSearch: {
        position: "absolute",
        right: 10,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
})

export default Input
