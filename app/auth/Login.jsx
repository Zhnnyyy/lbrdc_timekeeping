import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  StatusBar,
  Dimensions,
  Switch,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import InputText from "../components/InputText";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
const logo = require("../assets/lbrdc-logo-rnd.webp");
const { width, height } = Dimensions.get("window");

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const login = async () => {
    const loc_status = await Location.requestForegroundPermissionsAsync();
    if (loc_status.status == "granted") {
      router.replace("/dashboard/dashboard");
    } else {
      login();
    }
  };
  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      (e) => {
        Alert.alert("Heyy", "Are you sure you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    );
    return () => backhandler.remove();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={"dark-content"} />
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.img} source={logo} />
          <Text style={styles.appTitle}>LBRDC Timekeeper</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.wctxt}>Welcome Back</Text>
          <InputText />
          <InputText />

          <View style={styles.rememberForgotContainer}>
            <View style={styles.rememberMeContainer}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={rememberMe ? "#4CAF50" : "#f4f3f4"}
              />
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <Button onClick={login} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
  },
  img: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  wctxt: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    marginLeft: 8,
    color: "#666",
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
