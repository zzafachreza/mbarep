import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    DeviceEventEmitter,
    NativeEventEmitter,
    PermissionsAndroid,
    View,
    ToastAndroid,
    SafeAreaView,
    FlatList,
    ImageBackground,
    Image,
    Linking,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { colors, logoCetak } from '../../utils/colors';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { getData, urlAPI, urlAPINEW } from '../../utils/localStorage';
import { MyButton, MyGap, MyInput } from '../../components';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import { useIsFocused } from '@react-navigation/native';

export default function BayarPiutang({ navigation, route }) {
    const item = route.params;

    const [kirim, setKirim] = useState(route.params);

    const bayarData = () => {
        console.log(kirim);

        axios.post(urlAPINEW + 'bayar', kirim).then(res => {
            console.log(res.data);
            navigation.goBack();
        })
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 10,
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{
                    fontFamily: fonts.secondary[600],
                    textAlign: 'center',
                    fontSize: 20,
                }}>{item.kode}</Text>


                <Text style={{
                    fontFamily: fonts.secondary[400],
                    textAlign: 'center',
                    fontSize: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border_list
                }}>{item.status}</Text>

                <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: 20,
                    textAlign: 'center',
                    marginVertical: 10,
                    color: colors.success,
                    borderBottomColor: colors.border_list
                }}>Rp. {new Intl.NumberFormat().format(item.total)}</Text>


                <MyInput label="Bayar" iconname="create" autoFocus keyboardType='number-pad' value={kirim.sisa} />
                <MyGap jarak={10} />
                <MyButton title="Bayar" warna={colors.primary} Icons="download-outline" onPress={bayarData} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})