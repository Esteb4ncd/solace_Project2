import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import LargeButton from "../../components/ui/LargeButton";

export default function HomeScreen() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    terms: false,
  });
  const [isLogin, setIsLogin] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Username validation (only for sign up)
    if (!isLogin && !form.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Password validation
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Terms validation (only for sign up)
    if (!isLogin && !form.terms) {
      newErrors.terms = "You must agree to the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Navigate to tutorial after successful form validation
      router.push('/(tabs)/tutorial');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function signInForm() {
    return (
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={form.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            value={form.username}
            onChangeText={(value) => handleChange("username", value)}
            autoCapitalize="none"
            placeholder="Username"
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={form.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
            placeholder="Password"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <Pressable
          style={styles.checkboxContainer}
          onPress={() => handleChange("terms", !form.terms)}
        >
          <View style={[styles.checkbox, form.terms && styles.checkboxChecked]}>
            {form.terms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the</Text>
          <Text style={styles.loginLink}>Terms and Conditions</Text>
        </Pressable>
        {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

        <View style={styles.button}>
          <LargeButton label="Create the account" onPress={handleSubmit} style={undefined} />
        </View>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink} onPress={() => setIsLogin(true)}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    );
  }

  function logInForm() {
    return (
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={form.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email or Username"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={form.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
            placeholder="Password"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <Text>Forgot your password? </Text>

        <View style={styles.button}>
          <LargeButton label="Login" onPress={handleSubmit} style={undefined} />
        </View>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>
            Don't have an account?{" "}
            <Text style={styles.loginLink} onPress={() => setIsLogin(false)}>
              Register Now!
            </Text>
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo_text.png")}
          style={styles.logo}
        />
        {isLogin ? logInForm() : signInForm()}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    width: 393,
    height: 852,
  },
  logo: {
    marginTop: 150,
    alignSelf: "center",
    width: 306,
    resizeMode: "contain",
    marginBottom: 40,
  },
  form: {
    marginTop: 20,
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
    marginRight: 5,
  },
  loginLinkContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    color: "#564DA3",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 70,
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 2,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});
