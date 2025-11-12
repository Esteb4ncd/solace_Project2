import { useButton } from "@react-native-aria/button";
import { useNavigation } from "@react-navigation/native";
import { useToggleState } from "@react-stately/toggle";
import { Pressable, StyleSheet, View } from "react-native";

const BackButton = ({ onPress, style }) => {
  const state = useToggleState({});
  const navigation = useNavigation();
  const { buttonProps } = useButton(
    {
      onPress: onPress ? onPress : () => navigation.goBack(),
      isDisabled: false,
    },
    state
  );

  return (
    <View style={[styles.container, style]}>
      <Pressable {...buttonProps} style={styles.button}>
        <View style={styles.LeftArrow}></View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 80,
    left: 16,
    zIndex: 1000,
    alignItems: "flex-start",
  },
  button: {
    display: "flex",
    height: 48,
    width: 48,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#D3D0F3",
  },
  LeftArrow: {
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

export default BackButton;
