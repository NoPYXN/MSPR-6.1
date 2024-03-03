import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const TextZoneInfo = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      onSubmit(inputValue);
      setInputValue('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={setInputValue}
        value={inputValue}
        placeholder="Saisissez vos indications ici"
        multiline={true}
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
        <View style={styles.sendButtonContent}>
          <FontAwesome name="send" size={20} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    padding: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'blue',
    marginLeft: 10, 
  },
  sendButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextZoneInfo;
