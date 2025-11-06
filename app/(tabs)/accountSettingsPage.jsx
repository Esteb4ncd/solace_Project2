import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import BottomNavigation from "../../components/ui/BottomNavigation";
import XPBar from "../../components/ui/XPBar";
import SettingsButton from "../../components/ui/SettingsButton";
import { Globals } from "../../constants/globals";

function AccountSettingsPage() {
  const [username, setUsername] = useState("User123");
  const [email, setEmail] = useState("user123@example.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    // Save the settings
    Globals.userSettings = {
      username,
      email,
      notificationsEnabled,
      darkMode,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.mascotAndProgress}>
          <Image
            source={require("../../assets/images/Mascot-standing.png")}
            style={{
              width: 77,
              height: 155,
              alignSelf: "center",
              marginBottom: 5,
              marginTop: 10
            }}
          />
        <XPBar progress={0.5} />
      </View>
      <View style={styles.titleContainer}>
        <Image
          source={require("../../assets/images/Setting_fill.png")}
          style={{ width: 33, height: 33 }}
        />
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.buttonContainer}>
        <SettingsButton title="General" onPress={() => {}} />
        <SettingsButton title="Accessibility" onPress={() => {}} />
        <SettingsButton title="Notifications" onPress={() => {}} />
        <SettingsButton title="Account" onPress={() => {}} />
        <SettingsButton title="About" onPress={() => {}} />
        <SettingsButton title="Logout" onPress={() => {
            // Navigate to login page
            router.push("/(tabs)/signInPage");
        }}
        />
      </View>
      </View>
    <View>
      <BottomNavigation styles={styles.navigationBar} />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 17,
    paddingTop: 80,
    backgroundColor: "#fff",
  },
  mascotAndProgress: {
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F1F0FB",
    borderRadius: 16,
    paddingBottom: 17,
    paddingTop: 17,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#000",
  },

  navigationBar: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    justifyContent: "center",
  },
});

export default AccountSettingsPage;
