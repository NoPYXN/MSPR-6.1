import React, {useState} from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const AddPlantForm = () => {
    const [imageUri, setImageUri] = useState(null);

    const handleChoosePhoto = () => {
      const options = {
        noData: true,
      };
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.uri) {
          setImageUri(response.uri);
        }
      });
    };

  return (

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nom de la plante</Text>
        <TextInput style={styles.input} placeholder="Entrez le nom de la plante" />

        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} placeholder="Entrez une description" multiline />

        <Text style={styles.label}>Date de jardinage</Text>
        <TextInput style={styles.input} placeholder="Sélectionnez une date" />

        <Pressable style={styles.uploadButton} onPress={handleChoosePhoto}>
          <Text>Ajouter des photos</Text>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain"/>}
        </Pressable>

        <Pressable style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Valider</Text>
        </Pressable>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    borderStyle: 'dashed',
    padding: 20,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Plus de styles si nécessaire
});

export default AddPlantForm;
