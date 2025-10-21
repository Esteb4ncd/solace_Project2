import { Pressable, StyleSheet, View } from "react-native";

export default function CircularBackArrowButton({ onPress }) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onPress}>
        <View style={styles.Leftarrow}></View>
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
  Leftarrow: {
    left: 2.3,
    width: 18,
    height: 18,
    borderLeftWidth: 4.77,
    borderBottomWidth: 4.77,
    transform: [{ rotate: "45deg" }],
    borderColor: "#FFFFFF",
    borderLeft: "4.77px solid white",
    borderBottom: "4.77px solid white",
  },
});
