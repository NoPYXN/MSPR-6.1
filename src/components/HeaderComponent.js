import React from "react";
import { View, Image, Pressable, StyleSheet, Platform } from "react-native";

let AsyncStorage;
if (Platform.OS !== 'web') {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

const HeaderComponent = ({ navigation }) => {
  const handleReload = () => {
    if (Platform.OS === 'web') {
      if (window.location.pathname === "/") {
        window.history.pushState({}, "", "/");
        window.location.reload();
      } else {
        window.history.pushState({}, "", "/");
        window.location.reload();
      }
    } else {
      navigation.navigate("HomeScreen", { reload: true });
    }
  };

  const directionLoginOrProfil = async () => {
    let token;
    if (Platform.OS === 'web') {
      token = localStorage.getItem("token");
    } else {
      token = await AsyncStorage.getItem("token");
    }

    if (token) {
      console.log("Test redirection");
      navigation.navigate("ProfilScreen");
    } else {
      navigation.navigate("LoginScreen");
    }
  };

  const getImage = async () => {
    let image;
    if (Platform.OS === 'web') {
      image = localStorage.getItem("image");
    } else {
      image = await AsyncStorage.getItem("image");
    }
    return image;
  };

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => {}}>
        <View>
          <Image source={require("../assets/menu.png")} style={styles.icon} resizeMode="contain" />
        </View>
      </Pressable>
      <Pressable onPress={handleReload}>
        <View>
          <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </Pressable>
      <Pressable onPress={directionLoginOrProfil}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          {getImage() ? (
            <Image source={{ uri: getImage() }} style={styles.iconImage} resizeMode="contain" />
          ) : (
            <Image source={require("../assets/profil.png")} style={styles.icon} resizeMode="contain" />
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "green",
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  iconImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default HeaderComponent;
