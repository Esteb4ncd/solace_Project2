import { useCheckbox } from '@react-native-aria/checkbox';
import { useToggleState } from '@react-stately/toggle';
import { Pressable, View, Text } from 'react-native';

type MyCheckboxProps = {
  label: string;
};

const MyCheckbox = ({ label }: MyCheckboxProps) => {
  const state = useToggleState({});
  const { inputProps } = useCheckbox({}, state);

  return (
    <Pressable
      {...inputProps}
      style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderWidth: 2,
          borderColor: 'black',
          backgroundColor: state.isSelected ? 'black' : 'white',
          marginRight: 8,
        }}
      />
      <Text>{label}</Text>
    </Pressable>
  );
};

export default MyCheckbox;
