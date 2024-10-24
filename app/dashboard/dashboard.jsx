import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import GButton from "../components/GButton";
import * as Location from "expo-location";
import * as turf from "@turf/turf";
import * as Network from "expo-network";
import worldTimestamp from "world-timestamp";
import { router } from "expo-router";
import Constants from "expo-constants";
// import moment from "moment-timezone";
const dashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState("Loading time...");
  const [location, setLocation] = useState("Loading location...");
  const [lastAction, setLastAction] = useState("No recent action");
  const [status, setStatus] = useState("Checked Out");
  const [isConnected, setIsConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { _datetime } = Constants.expoConfig?.extra || {};

  //load connection
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        if (networkState.isConnected) {
          const test = await fetch("https://www.google.com");
          test.ok ? setIsConnected(true) : setIsConnected(false);
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };
    checkNetwork();
  }, []);

  //load date and time
  useEffect(() => {
    setInterval(() => {
      loadDatatime();
    }, 1000);
  }, []);

  //load location
  useEffect(() => {
    loadLoc();
  }, []);

  const isValid = () => {
    const userLocation = [longitude, latitude];
    const geofenceCenter = [120.99674507047705, 14.741638157279192];
    const geofenceRadius = 6.398233881168904;
    const distance = turf.distance(
      turf.point(userLocation),
      turf.point(geofenceCenter),
      { units: "meters" }
    );

    if (distance <= geofenceRadius) {
      console.log("You are inside the geofence.");
    } else {
      console.log("You are outside the geofence.");
    }
  };

  const loadLoc = async () => {
    const coordinates = await Location.getCurrentPositionAsync({});
    const latitude = coordinates.coords.latitude;
    const longitude = coordinates.coords.longitude;
    const currentLocation = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    setLocation(`${currentLocation[0].formattedAddress}`);
  };
  const loadDatatime = async () => {
    const request = await fetch(_datetime);
    const result = await request.json();
    setCurrentDateTime(result.datetime);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadDatatime();
    loadLoc();
    setRefreshing(false);
  }, []);

  const handleCheckIn = async () => {
    console.log("clicked");
    alert(_datetime);
  };

  // useEffect(() => {
  //   const backhandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     (e) => {
  //       Alert.alert("Heyy", "Are you sure you want to exit?", [
  //         { text: "Cancel", onPress: () => null, style: "cancel" },
  //         { text: "Yes", onPress: () => BackHandler.exitApp() },
  //       ]);
  //       return true;
  //     }
  //   );
  //   return () => backhandler.remove();
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Ed Emmanuel Perpetua</Text>
          <Text style={styles.employeeId}>ID: 0032424</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="log-out-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        bounces
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Status</Text>
          <Text style={styles.status}>{status}</Text>
          <Text style={styles.dateTime}>{currentDateTime}</Text>
          <Text
            style={
              (styles.location,
              [
                {
                  color: isConnected ? "#363636" : "red",
                  fontWeight: isConnected ? "regular" : "bold",
                },
              ])
            }
          >
            {isConnected ? location : "Offline mode"}
          </Text>
          <Text>{isConnected}</Text>
        </View>

        <Text style={styles.sectionTitle}>Time Tracking</Text>
        <View style={styles.Grid}>
          <GButton
            title="Check In"
            icon="log-in-outline"
            color="#006341"
            textColor="#FFFFFF"
            handleAction={handleCheckIn}
          />
          <GButton
            title="Check Out"
            icon="log-out-outline"
            color="#006341"
            textColor="#FFFFFF"
          />
          <GButton
            title="Break In"
            icon="cafe-outline"
            color="#006341"
            textColor="#FFFFFF"
          />
          <GButton
            title="Break Out"
            icon="restaurant-outline"
            color="#006341"
            textColor="#FFFFFF"
          />
        </View>

        <Text style={styles.sectionTitle}>Special Actions</Text>
        <View style={styles.Grid}>
          <GButton
            title="Overtime In"
            icon="time-outline"
            color="#FDB913"
            textColor="#006341"
          />
          <GButton
            title="Overtime Out"
            icon="timer-outline"
            color="#FDB913"
            textColor="#006341"
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <Text style={styles.lastAction}>{lastAction}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#006341",
    borderBottomWidth: 1,
    borderBottomColor: "#004D31",
  },
  userInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  employeeId: {
    fontSize: 16,
    color: "#E0E0E0",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#006341",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006341",
    marginBottom: 12,
  },
  status: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#006341",
    marginBottom: 12,
  },
  dateTime: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006341",
    marginTop: 24,
    marginBottom: 16,
  },
  Grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
});
