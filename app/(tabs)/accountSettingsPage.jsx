import { router } from "expo-router";
import { useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import BackButton from "../../components/ui/BackButton";
import BottomNavigation from "../../components/ui/BottomNavigation";
import SettingsButton from "../../components/ui/SettingsButton";
import XPBar from "../../components/ui/XPBar";
import { Globals } from "../../constants/globals";
import AboutSettingsContent from "./settingsContentPages/aboutSettings";
import AccessibilitySettingsContent from "./settingsContentPages/accessibilitySettings";
import AccountSettingsContent from "./settingsContentPages/accountSettings";
import GeneralSettingsContent from "./settingsContentPages/generalSettings";
import NotificationSettingsContent from "./settingsContentPages/notificationSettings";

function AccountSettingsPage() {
  const [username, setUsername] = useState("User123");
  const [email, setEmail] = useState("user123@example.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [activeSection, setActiveSection] = useState(null);

  const handleSave = () => {
    // Save the settings
    Globals.userSettings = {
      username,
      email,
      notificationsEnabled,
      darkMode,
    };
  };

  const handleSectionPress = (section) => {
    setActiveSection(section);
    setShowContent(false);
  };

  const handleBackPress = () => {
    setShowContent(true);
    setActiveSection(null);
  };

  const handleNavPress = (itemId) => {
    switch (itemId) {
      case 'home':
        router.push('/(tabs)/homePage');
        break;
      case 'physical':
        router.push('/(tabs)/physicalHomePage');
        break;
      case 'mental':
        router.push('/(tabs)/mentalHomePage');
        break;
      case 'account':
        // Already on account page
        break;
      default:
        console.log(`Navigating to ${itemId}`);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "General":
        return <GeneralSettingsContent />;
      case "Accessibility":
        return <AccessibilitySettingsContent />;
      case "Notifications":
        return <NotificationSettingsContent />;
      case "Account":
        return <AccountSettingsContent />;
      case "About":
        return <AboutSettingsContent />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {!showContent && (
        <View style={styles.backButtonContainer}>
          <View style={styles.headerRow}>
            <BackButton onPress={handleBackPress} style={styles.backButton} />
            <Text style={styles.activeSectionText}>{activeSection}</Text>
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderSectionContent()}
          </ScrollView>
        </View>
      )}

      {showContent && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <View style={styles.mascotAndProgress}>
              <Image
                source={require("../../assets/images/Mascot-standing.png")}
                style={{
                  width: 77,
                  height: 155,
                  alignSelf: "center",
                  marginBottom: 5,
                  marginTop: 10,
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
              <SettingsButton
                title="Account"
                onPress={() => handleSectionPress("Account")}
              />
              <SettingsButton
                title="General"
                onPress={() => handleSectionPress("General")}
              />
              <SettingsButton
                title="Accessibility"
                onPress={() => handleSectionPress("Accessibility")}
              />
              <SettingsButton
                title="Notifications"
                onPress={() => handleSectionPress("Notifications")}
              />
              <SettingsButton
                title="About"
                onPress={() => handleSectionPress("About")}
              />
              <SettingsButton
                title="Logout"
                onPress={() => {
                  // Navigate to login page
                  router.push("/(tabs)/signInPage");
                }}
              />
            </View>
          </View>
        </ScrollView>
      )}

      <View>
        <BottomNavigation onItemPress={handleNavPress} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  contentContainer: {
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
    fontFamily: Globals.fonts.weights.bold,
    marginLeft: 8,
    color: "#000",
  },
  backButtonContainer: {
    paddingTop: 60,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
    marginTop: 20,
  },
  activeSectionText: {
    fontSize: 24,
    fontFamily: Globals.fonts.weights.bold,
    color: "#000",
    textAlign: "center",
    flex: 1,
  },
  navigationBar: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    justifyContent: "center",
  },
});

export default AccountSettingsPage;
