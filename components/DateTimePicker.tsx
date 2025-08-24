import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';

interface DateTimePickerComponentProps {
  label: string;
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
}

export default function DateTimePickerComponent({
  label,
  value,
  mode,
  onChange,
}: DateTimePickerComponentProps) {
  const [show, setShow] = useState(false);

  const onDateTimeChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatValue = () => {
    if (mode === 'date') {
      return value.toLocaleDateString('tr-TR');
    } else {
      return value.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const IconComponent = mode === 'date' ? Calendar : Clock;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShow(true)}
      >
        <IconComponent size={20} color="#8B5CF6" />
        <Text style={styles.valueText}>{formatValue()}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
});