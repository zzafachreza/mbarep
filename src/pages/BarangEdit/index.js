import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { MyButton, MyGap, MyInput } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { showMessage } from 'react-native-flash-message';
import { getData, storeData, urlAPI, urlAPINEW } from '../../utils/localStorage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { Alert } from 'react-native';

export default function BarangEdit({ navigation, route }) {
    const item = route.params;
    navigation.setOptions({
        headerShown: false,
    });
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    const isFocused = useIsFocused();

    const [jumlah, setJumlah] = useState(1);
    const [user, setUser] = useState({});
    const [cart, setCart] = useState(0);

    useEffect(() => {
        if (isFocused) {
            // modalizeRef.current.open();
            getData('user').then(res => {
                console.log('data user', res);
                setUser(res);
            });
            getData('cart').then(res => {
                console.log(res);
                setCart(res);
            });
        }

        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
            console.log("Keyboard Shown")
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
            console.log("Keyboard Hide")
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };

    }, [isFocused]);

    const modalizeRef = useRef();

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const addToCart = () => {
        const kirim = {
            fid_user: user.id,
            fid_barang: item.id,
            harga_dasar: item.harga_dasar,
            diskon: item.diskon,
            harga: item.harga_barang,
            qty: jumlah,
            uom: uom,
            harga_new: note,
            total: item.harga_barang * jumlah
        };

        if (note == 0) {
            Alert.alert('Mbarep Group', 'Maad stok produk kosong !')
        } else {
            console.log('kirim tok server', kirim);
            axios.post(urlAPINEW + 'edit_harga', {
                id_barang: item.id,
                harga_new: note,
            }).then(res => {
                console.log(res.data);
                navigation.goBack();
            })

        }
    };
    const [uom, setUom] = useState(route.params.satuan);
    const [note, setNote] = useState('');


    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background1,
            }}>
            <View
                style={{
                    height: 50,
                    // padding: 10,
                    paddingRight: 10,
                    backgroundColor: colors.primary,

                    flexDirection: 'row',
                }}>
                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Icon type="ionicon" name="arrow-back-outline" color={colors.white} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: windowWidth / 30,
                            color: colors.white,
                        }}>
                        {item.nama_barang}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background1,

                }}>

                <View
                    style={{
                        backgroundColor: colors.background1,
                        flex: 1,
                        padding: 10,
                    }}>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: windowWidth / 20,
                            color: colors.danger,
                        }}>
                        Rp. {new Intl.NumberFormat().format(item.harga_barang)}
                    </Text>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: windowWidth / 20,
                            color: colors.black,
                        }}>
                        {item.nama_barang}
                    </Text>

                    <MyInput onChangeText={x => setNote(x)} keyboardType='number-pad' iconname="create" placeholder="masukan harga baru" label="Update Harga" />
                </View>


                <View style={{ margin: 10, }}>
                    <MyButton onPress={addToCart} warna={colors.primary} title="SIMPAN PERUBAHAN" Icons="refresh" />
                </View>
            </View>




        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    not: {
        width: 60,
        borderRadius: 20,
        borderWidth: 2,
        marginHorizontal: 2,
        borderColor: colors.primary,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    ok: {
        width: 60,
        marginHorizontal: 2,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    notText: {
        fontSize: windowWidth / 35,
        color: colors.primary,
        fontFamily: fonts.secondary[600],
    },
    okText: {
        fontSize: windowWidth / 35,
        color: colors.white,
        fontFamily: fonts.secondary[600],
    }
});
