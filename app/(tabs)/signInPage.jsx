import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LargeButton from "../../components/ui/LargeButton";

function LoginSignInPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    terms: false,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Handle sign in logic here
    console.log("Form submitted:", form);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo_text.png")}
        style={styles.logo}
      />
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={(value) => handleChange("username", value)}
            autoCapitalize="none"
            placeholder="Username"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
            placeholder="Password"
          />
        </View>

        <Pressable
          style={styles.checkboxContainer}
          onPress={() => handleChange("terms", !form.terms)}
        >
          <View style={[styles.checkbox, form.terms && styles.checkboxChecked]}>
            {form.terms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the Terms and Conditions
          </Text>
        </Pressable>

        <LargeButton label="Create the account" onPress={handleSubmit} />
      </View>

      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => console.log("Navigate to login")}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logo: {
    marginTop: 150,
    alignSelf: "center",
    width: 306,
    resizeMode: "contain",
    marginBottom: 40,
  },
  form: {
    flex: 1,

  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    fontWeight: "bold",
    borderWidth: 1.5,
    borderColor: "#7267D9",
    borderRadius: 9.07,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 70,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#28244C",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  loginLinkContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#333",
  },
  loginLink: {
    color: "purple",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default LoginSignInPage;
