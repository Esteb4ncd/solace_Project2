import { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Globals } from "../../constants/globals";

export default function SettingsButton({ title, onPress }) {
  const isLogout = title === "Logout";
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handlePress = () => {
    if (isLogout) {
      setShowLogoutModal(true);
    } else {
      onPress && onPress();
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <View style={styles.content}>
          <Text style={[styles.buttonText, isLogout && styles.logoutText]}>
            {title}
          </Text>
          {!isLogout && <View style={styles.arrow} />}
        </View>
      </TouchableOpacity>

      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require("../../assets/images/settings-popup.png")}
              style={{ width: 105, height: 120, marginBottom: 20 }}
            />
            <Text style={styles.modalTitle}>You're leaving?</Text>
            <TouchableOpacity
              style={styles.stayButton}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.stayButtonText}>Stay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={() => {
                onPress && onPress();
                setShowLogoutModal(false);
              }}
            >
              <Text style={styles.leaveButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderColor: "#7267D9",
    borderWidth: 1,
    height: 62,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontFamily: Globals.fonts.weights.bold,
    textAlign: "left",
    flex: 1,
  },
  logoutText: {
    color: "#AE2F1B",
    textAlign: "left",
  },
  arrow: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: "#000000",
    borderBottomColor: "#000000",
    transform: [{ rotate: "-45deg" }],
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 367,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: Globals.fonts.weights.bold,
    color: "#000000",
    textAlign: "center",
  },
  stayButton: {
    width: 150,
    height: 60,
    backgroundColor: "#C2E273",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 8,
  },
  leaveButton: {
    margin: 10,
  },
  stayButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: Globals.fonts.weights.bold,
  },
  leaveButtonText: {
    color: "black",
    fontSize: 16,
    fontFamily: Globals.fonts.weights.bold,
  },
});
