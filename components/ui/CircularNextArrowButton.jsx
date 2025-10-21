import { Pressable, StyleSheet, View } from "react-native";

export default function CircularNextArrowButton({ onPress }) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onPress}>
        <View style={styles.Rightarrow}></View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
  },
  button: {
    display: "block",
    backgroundColor: "#A2BC60",
    padding: 17,
    position: "absolute",
  },
  Rightarrow: {
    right: 2.3,
    width: 18,
    height: 18,
    borderRightWidth: 4.77,
    borderBottomWidth: 4.77,
    transform: [{ rotate: "-45deg" }],
    borderColor: "#FFFFFF",
    borderRight: "4.77px solid white",
    borderBottom: "4.77px solid white",
  },
});
