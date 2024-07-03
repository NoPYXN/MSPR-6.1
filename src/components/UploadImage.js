import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome } from "@expo/vector-icons";

const UploadImage = ({
    selectedImage,
    setSelectedImage,
    setIsChangeUploadFile,
    isChangeUploadFile,
    selectedFile,
    tabImages,
    setTabImages,
}) => {
    const handleFileSelected = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync();
            if (result.type === "success") {
                const fileUri = result.uri;
                const metadata = await fetchMetadata(fileUri);
                if (metadata) {
                    const file = new File([await fetch(fileUri).then(r => r.blob())], metadata.name, { type: metadata.type });
                    setSelectedImage(file);
                }
            } else {
                console.log("Sélection de fichier annulée ou aucun fichier sélectionné");
            }
        } catch (err) {
            console.log("Erreur lors de la sélection du fichier :", err);
        }
    };

    const fetchMetadata = async (fileUri) => {
        try {
            const response = await fetch(fileUri);
            const contentDisposition = response.headers.get("Content-Disposition");
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const filenameMatch = filenameRegex.exec(contentDisposition);
            const defaultName = "Untitled";
            const name = filenameMatch ? filenameMatch[1].replace(/['"]/g, "") : defaultName;
            const blob = await response.blob();
            return new File([blob], name, { type: blob.type });
        } catch (error) {
            console.error("Erreur lors de la récupération des métadonnées du fichier:", error);
            return null;
        }
    };

    useEffect(() => {
        if (isChangeUploadFile) {
            handleSubmit();
        }
    }, [selectedImage]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "ml_default");
        const response = await fetch(`http://localhost:8080/api/v1/upload/uploadPhotoUser`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.upload) {
            setTabImages([...tabImages, {
                api_key: data.message.public_id.split("Arosaje/annonces/")[1],
                secure_url: data.message.secure_url,
            }]);
        }
    };

    const deleteImage = async (id) => {
        const response = await fetch(`http://localhost:8080/api/v1/upload/upload/` + id, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
        });
        const data = await response.json();
        if (data.delete) {
            setTabImages(tabImages.filter(element => element.api_key !== id));
        }
    };

    return (
        <View>
            <View style={styles.uploadButton}>
                <Pressable onPress={handleFileSelected}>
                    <Text style={styles.labelUploadButton}>Sélectionner un fichier</Text>
                </Pressable>
                {selectedFile && <Text>Fichier sélectionné : {selectedFile.name}</Text>}
            </View>
            <View style={styles.viewTabImage}>
                {tabImages && tabImages.map((image, index) => (
                    <View key={index} style={styles.viewImageMap}>
                        <Pressable onPress={() => deleteImage(image.api_key)} style={styles.croix}>
                            <FontAwesome name="trash" size={15} color="black" />
                        </Pressable>
                        <Image source={{ uri: image.secure_url }} style={styles.imagetab} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    labelUploadButton: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        borderStyle: "dashed",
        padding: 20,
        marginBottom: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    viewTabImage: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "5%",
    },
    viewImageMap: {
        margin: "2%",
        position: "relative",
    },
    imagetab: {
        height: 100,
        width: 100,
    },
    croix: {
        position: "absolute",
        top: 2,
        right: 2,
        zIndex: 1,
    },
});

export default UploadImage;
