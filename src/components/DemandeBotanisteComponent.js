import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome } from '@expo/vector-icons';

const DemandeBotanisteScreen = () => {
    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileSelected = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
            if (result.type === "success") {
                setSelectedFiles([...selectedFiles, result]);
            } else {
                console.log("Sélection de fichier annulée ou aucun fichier sélectionné");
            }
        } catch (err) {
            console.log("Erreur lors de la sélection du fichier :", err);
        }
    };

    const handleSubmit = async () => {
        // Logique pour envoyer le message et les fichiers sélectionnés
        console.log("Message: ", message);
        console.log("Selected Files: ", selectedFiles);
        // Envoyer les données à votre serveur ou à votre API ici
    };

    const deleteFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Demande Botaniste</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Écrire votre message..."
                        value={message}
                        onChangeText={setMessage}
                        multiline
                    />
                    <View style={styles.fileUploadContainer}>
                        <Pressable onPress={handleFileSelected} style={styles.uploadButton}>
                            <Text style={styles.uploadButtonText}>Sélectionner un fichier PDF</Text>
                        </Pressable>
                        <View style={styles.fileList}>
                            {selectedFiles.map((file, index) => (
                                <View key={index} style={styles.fileItem}>
                                    <Text style={styles.fileName}>{file.name}</Text>
                                    <Pressable onPress={() => deleteFile(index)} style={styles.deleteButton}>
                                        <FontAwesome name="trash" size={20} color="black" />
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Pressable onPress={handleSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Envoyer</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollViewContainer: {
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    textInput: {
        height: 150,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: "top",
    },
    fileUploadContainer: {
        marginBottom: 20,
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        borderStyle: "dashed",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    uploadButtonText: {
        color: "#007BFF",
        fontSize: 16,
    },
    fileList: {
        marginTop: 10,
    },
    fileItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    fileName: {
        fontSize: 16,
    },
    deleteButton: {
        padding: 5,
    },
    submitButton: {
        backgroundColor: "#5cb85c",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DemandeBotanisteScreen;
