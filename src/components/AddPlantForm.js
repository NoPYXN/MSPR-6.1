import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Platform } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Conditionally import `react-datepicker` for web
let DatePicker;
if (Platform.OS === 'web') {
  DatePicker = require('react-datepicker').default;
  require('react-datepicker/dist/react-datepicker.css');
}

const AddPlantForm = () => {
  const [imageUri, setImageUri] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Only relevant for iOS, to keep the picker open
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Nom de la plante</Text>
      <TextInput style={styles.input} placeholder="Entrez le nom de la plante" />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} placeholder="Entrez une description" multiline />

      <Text style={styles.label}>Date de jardinage</Text>
      <Pressable onPress={showDatepicker} style={[styles.input, styles.datePickerInput]}>
        <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
      </Pressable>
      {show && Platform.OS !== 'web' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      {show && Platform.OS === 'web' && DatePicker && (
        <DatePicker selected={date} onChange={(newDate) => setDate(newDate)} inline />
      )}
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
  });
  
  export default AddPlantForm;
  