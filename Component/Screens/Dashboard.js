import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      {/* Top section */}
      <Text style={styles.title}>Dashboard</Text>
      <Image
        source={require("../../assets/profile.png")} // replace with your image
        style={styles.avatar}
      />
      <Text style={styles.name}>Mr. Fernando</Text>

      {/* Button grid */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card}>
          <MaterialIcons name="checklist" size={28} color="#fff" />
          <Text style={styles.cardText}>Mark Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="person-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="people-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Student's Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <MaterialIcons name="bar-chart" size={28} color="#fff" />
          <Text style={styles.cardText}>Class Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="document-text-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <FontAwesome5 name="bolt" size={28} color="#fff" />
          <Text style={styles.cardText}>Quick Access</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={22} color="#fff" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 10,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 12,
    width: "47%",
    height: 100,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    color: "#fff",
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
});
