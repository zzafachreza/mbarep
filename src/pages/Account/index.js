import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { windowWidth, fonts } from '../../utils/fonts';
import { getData, storeData } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from "react-native-thermal-receipt-printer";

export default function Account({ navigation, route }) {
  const [user, setUser] = useState({});
  const [com, setCom] = useState({});
  const isFocused = useIsFocused();
  const [wa, setWA] = useState('');

  const [paired, setPaired] = useState({
    device_name: '',
    inner_mac_address: ''
  });


  useEffect(() => {
    if (isFocused) {
      getData('user').then(res => {
        setUser(res);
        console.error(res);
      });


      getData('paired').then(res => {
        if (!res) {
          setPaired({
            device_name: '',
            inner_mac_address: ''
          })
        } else {
          setPaired(res)
        }
      })

    }
  }, [isFocused]);

  const btnKeluar = () => {
    storeData('user', null);

    navigation.replace('Login');
  };

  const kirimWa = x => {
    Linking.openURL(
      'https://api.whatsapp.com/send?phone=' +
      x +
      '&text=Halo%20NIAGA%20BUSANA',
    );
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.background1,
    }}>
      <View style={{ padding: 10 }}>


        {/* data detail */}
        <View style={{ padding: 10 }}>


          <MyGap jarak={10} />
          <View>
            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Nama Lengkap
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  color: colors.primary,
                }}>
                {user.nama_lengkap}
              </Text>
            </View>



            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Telepon / Whatsapp
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  color: colors.primary,
                }}>
                {user.telepon}
              </Text>
            </View>

            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Alamat
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  color: colors.primary,
                }}>
                {user.alamat}
              </Text>
            </View>

            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Printer
              </Text>
              <View style={{
                flexDirection: 'row'
              }}>
                <View style={
                  {
                    flex: 1,
                  }
                }>
                  <Text
                    style={{
                      fontFamily: fonts.secondary[600],
                      color: colors.primary,
                    }}>
                    {paired.device_name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.secondary[400],
                      color: colors.black,
                    }}>
                    {paired.inner_mac_address}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('PrinterBluetooth')} style={{
                  backgroundColor: colors.danger,
                  flexDirection: 'row',
                  width: 80,
                  justifyContent: 'center',
                  padding: 5,
                  borderRadius: 10,
                  alignItems: 'center'
                }}>
                  <Icon type='ionicon' name='print-outline' color={colors.white} />
                  <Text style={{
                    left: 5,
                    fontFamily: fonts.secondary[400],
                    color: colors.white,
                  }}>Ubah</Text>
                </TouchableOpacity>
              </View>
            </View>





          </View>
        </View>

        {/* button */}
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <View style={{
            flex: 1,
            paddingRight: 5,
          }}>
            <MyButton
              onPress={() => navigation.navigate('EditProfile', user)}
              title="Edit Profile"
              colorText={colors.white}
              iconColor={colors.white}
              warna={colors.secondary}
              Icons="create-outline"
            />
          </View>
          <View style={{
            flex: 1,
            paddingLeft: 5,
          }}>
            <MyButton
              onPress={btnKeluar}
              title="Keluar"
              colorText={colors.white}
              iconColor={colors.white}
              warna={colors.primary}
              Icons="log-out-outline"
            />
          </View>
        </View>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({});
