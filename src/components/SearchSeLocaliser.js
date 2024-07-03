import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const SearchSeLocaliser = ({ setCoordonnees }) => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder='Entrer une adresse'
        onPress={(data, details = null) => {
          const localization = {
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          };
          const country = details.address_components.find(component => component.types.includes('country')).long_name;
          setCoordonnees({ localization, country });
        }}
        query={{
          key: 'YOUR_GOOGLE_MAPS_API_KEY', // Remplacez par votre clé API Google Maps
          language: 'fr',
          types: '(cities)', // Filtrer pour les résultats de type "localité" (ville)
        }}
        fetchDetails={true}
        styles={{
          textInput: styles.input,
          listView: styles.listView,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  listView: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
});

export default SearchSeLocaliser;
