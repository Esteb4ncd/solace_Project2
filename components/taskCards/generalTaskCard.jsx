import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Globals } from "../../constants/globals";

export default function generalTaskCard({ task, xp, onPress }) {
  return (
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={onPress || (() => {})}
    >
      <Text style={styles.taskTitle}>{task}</Text>
      <Text style={styles.xpText}>{xp}xp</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 0,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 360,
    height: 72,
    borderWidth: 1,
    borderColor: "#7267D9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    ...Globals.fonts.styles.header2Bold,
    color: "#443E82",
    flex: 1,
  },
  xpText: {
    ...Globals.fonts.styles.header2Bold,
    color: "#7267D9",
  },
});