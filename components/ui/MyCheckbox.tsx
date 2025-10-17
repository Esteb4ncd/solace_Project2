import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type MyCheckboxProps = {
  label: string;
  checked?: boolean;
  onPress?: () => void;
};

const MyCheckbox = ({ label, checked = false, onPress }: MyCheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handlePress = () => {
    setIsChecked(!isChecked);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderWidth: 2,
          borderColor: '#007AFF',
          backgroundColor: isChecked ? '#007AFF' : 'white',
          marginRight: 8,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked && (
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            ✓
          </Text>
        )}
      </View>
      <Text style={{ fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
};

export default MyCheckbox;
