import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Icon, ListItem, Button } from 'react-native-elements';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import DatePicker from 'react-native-datepicker'


export default function MyCalendar({
  label,
  iconname,
  onDateChange,
  value,
  keyboardType,
  secureTextEntry,
  styleInput,
  placeholder,
  label2,
  styleLabel,
  colorIcon = colors.primary,
  data = [],
}) {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 0,
        }}>
        <Icon type="ionicon" name={iconname} color={colors.black} size={16} />
        <Text
          style={{
            fontFamily: fonts.secondary[600],
            color: colors.primary,
            left: 10,
            fontSize: 12,
            ...styleLabel,
          }}>
          {label}
        </Text>
      </View>

      <View style={{
        backgroundColor: colors.zavalabs,
        borderRadius: 10,
        marginTop: 5,
        fontFamily: fonts.secondary[600],
        borderColor: colors.primary,
      }}>
        <DatePicker
          style={{ width: '100%', height: 45, }}
          date={value}
          mode="date"
          placeholder={placeholder}
          showIcon={false}
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              fontFamily: fonts.secondary[600],
              textAlign: 'left',
              borderWidth: 0,
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={onDateChange}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
