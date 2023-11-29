import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { MyButton, MyGap, MyInput } from '../../components'
import { colors } from '../../utils/colors'
import { Icon } from 'react-native-elements'
import { fonts } from '../../utils/fonts'
import { getData, storeData, urlAPI } from '../../utils/localStorage'
import axios from 'axios'
import { showMessage } from 'react-native-flash-message'
import { FlatList } from 'react-native'

export default function Customer({ navigation, route }) {

    useEffect(() => {
        getData('user').then(res => {
            setUser(res);
            console.log(res);
            setKirim({
                ...kirim,
                fid_member: res.id
            });
            getDataCustomer(res.id)
        });



    }, [])



    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [customer, setCustomer] = useState({
        id: '',
        nama_customer: '',
        telepon_customer: '',
        alamat_customer: '',
        keterangan_customer: '',

    });
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [kirim, setKirim] = useState({
        nama_customer: '',
        telepon_customer: '',
        alamat_customer: '',
        keterangan_customer: '',
    });
    const [data, setData] = useState([]);
    const [tmp, setTmp] = useState([]);

    const sendToServer = () => {
        setLoading(true);
        setOpen(false);
        console.log('sen to server', kirim);
        axios.post(urlAPI + '/1add_customer.php', kirim).then(res => {
            console.log('response server', res.data);
            setLoading(false);
            getDataCustomer();
            setKirim({
                nama_customer: '',
                telepon_customer: '',
                alamat_customer: '',
                keterangan_customer: ''
            })

        })

    }

    const sendToServer2 = () => {
        setLoading(true);
        setOpen2(false);
        console.log('sen to server', kirim);
        axios.post(urlAPI + '/1update_customer.php', kirim).then(res => {
            console.log('response server', res.data);
            setLoading(false);
            getDataCustomer();
            setKirim({
                nama_customer: '',
                telepon_customer: '',
                alamat_customer: '',
                keterangan_customer: ''
            })

        })
    }

    const deleteCustomer = (x) => {

        setLoading(true);

        axios.post(urlAPI + '/1delete_customer.php', {
            id_customer: x
        }).then(res => {
            console.log('response server', res.data);

            getDataCustomer();

        });

    }

    const getDataCustomer = (x) => {


        axios.post(urlAPI + '/1data_customer.php').then(res => {
            console.log('data customer', res.data);
            setData(res.data);
            setTmp(res.data)
            setLoading(false);
        })


    }

    return (
        <SafeAreaView style={{
            flex: 1,
        }}>
            <View style={{
                padding: 10,
                backgroundColor: colors.border_list
            }}>
                <MyInput label="Search" placeholder="Masukan kata kunci" onChangeText={x => {
                    console.log(x);

                    const filtered = data.filter(i => i.nama_customer.toLowerCase().indexOf(x.toLowerCase()) > -1)
                    console.log(filtered)

                    if (filtered.length == 0) {
                        setData(tmp)
                    } else if (x.length == 0) {
                        setData(tmp)
                    } else {
                        setData(filtered);
                    }


                }} iconname="search" />
                <Text style={{
                    marginBottom: 10,
                    fontFamily: fonts.secondary[400], fontSize: 13,
                }}>Customer Dipilih : <Text style={{
                    fontFamily: fonts.secondary[600], fontSize: 16,
                }}>{customer.nama_customer}</Text></Text>
                <MyButton onPress={() => setOpen(true)} title="Tambah Customer" warna={colors.secondary} Icons="add" />
            </View>
            {loading && <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>}
            {!open && !open2 && <ScrollView style={{
                flex: 1,
            }}>


                {!loading &&

                    <FlatList data={data} renderItem={({ item }) => {
                        return (
                            <View key={item.id_customer} style={{
                                marginHorizontal: 10,
                                marginVertical: 5,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: customer == item.nama_customer ? colors.success : colors.black,
                                padding: 10,
                                flexDirection: 'row',
                                marginBottom: 5,
                            }}>

                                <View style={{
                                    flex: 1
                                }}>
                                    <Text style={{
                                        flex: 1,
                                        color: customer == item.nama_customer ? colors.success : colors.black,
                                        fontFamily: fonts.secondary[600],
                                        fontSize: 16,
                                    }}>{item.nama_customer}</Text>
                                    <Text style={{
                                        flex: 1,
                                        fontFamily: fonts.secondary[400],
                                        fontSize: 12,
                                    }}>{item.telepon_customer}</Text>
                                    <Text style={{
                                        flex: 1,
                                        fontFamily: fonts.secondary[400],
                                        fontSize: 12,
                                    }}>{item.alamat_customer}</Text>
                                    <Text style={{
                                        flex: 1,
                                        fontFamily: fonts.secondary[400],
                                        fontSize: 12,
                                    }}>{item.keterangan_customer}</Text>
                                </View>



                                {customer.id != item.id && <TouchableOpacity style={{
                                    marginHorizontal: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} onPress={() => {
                                    Alert.alert(
                                        `${item.nama_customer}`,
                                        `Pilih customer ini ?`,
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK", onPress: () => {

                                                    storeData('customer', item);
                                                    setCustomer(item);

                                                    showMessage({
                                                        message: `${item.nama_customer} berhasil dipilih`,
                                                        type: 'success'
                                                    });

                                                }
                                            }
                                        ]
                                    );
                                }}>
                                    <Text style={{
                                        fontFamily: fonts.secondary[600],
                                        color: colors.success
                                    }}>Pilih</Text>
                                </TouchableOpacity>}


                                {customer.id == item.id && <TouchableOpacity style={{
                                    marginHorizontal: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} onPress={() => {
                                    Alert.alert(
                                        `${item.nama_customer}`,
                                        `batalkan pilih customer ini ?`,
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK", onPress: () => {

                                                    storeData('customer', {
                                                        id: '',
                                                        nama_customer: '',
                                                        alamat_customer: '',
                                                        keterangan_customer: ''
                                                    });

                                                    showMessage({
                                                        message: `${item.nama_customer} berhasil dipilih`,
                                                        type: 'success'
                                                    });
                                                    getNamaCustomer();
                                                }
                                            }
                                        ]
                                    );
                                }}>
                                    <Text style={{
                                        fontFamily: fonts.secondary[600],
                                        color: colors.danger
                                    }}>Batal</Text>
                                </TouchableOpacity>}

                                <TouchableOpacity onPress={() => {
                                    setOpen2(true);
                                    setKirim(item);
                                }}>
                                    <Icon type='ionicon' name='create-outline' color={colors.primary} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    Alert.alert(
                                        `${item.nama_customer}`,
                                        `Anda yakin akan hapus customer ini ?`,
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            { text: "OK", onPress: () => deleteCustomer(item.id) }
                                        ]
                                    );
                                }}>
                                    <Icon type='ionicon' name='trash' color={colors.secondary} />
                                </TouchableOpacity>



                            </View>
                        )
                    }} />}
            </ScrollView>}
            {open && <ScrollView style={{
                flex: 0.5,
                padding: 10,
                borderTopLeftRadius: 20,
                elevation: 4,

                borderTopRightRadius: 20,
                backgroundColor: colors.white
            }}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 15,
                        }}>Tambah Customer</Text>
                    </View>

                    <TouchableOpacity onPress={() => setOpen(false)} style={{

                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Icon type='ionicon' name='close' size={35} />
                    </TouchableOpacity>
                </View>
                <View>
                    <MyInput value={kirim.nama_customer} onChangeText={x => setKirim({
                        ...kirim,
                        nama_customer: x
                    })} autoFocus label="Nama Customer" iconname="card" />
                    <MyGap jarak={10} />
                    <MyInput value={kirim.telepon_customer} onChangeText={x => setKirim({
                        ...kirim,
                        telepon_customer: x
                    })} label="Telepon Customer" keyboardType="phone-pad" iconname="call" />
                    <MyGap jarak={20} />
                    <MyInput value={kirim.alamat_customer} onChangeText={x => setKirim({
                        ...kirim,
                        alamat_customer: x
                    })} label="Alamat" iconname="location" />
                    <MyGap jarak={20} />
                    <MyInput value={kirim.keterangan_customer} onChangeText={x => setKirim({
                        ...kirim,
                        keterangan_customer: x
                    })} label="Keterangan" iconname="create" />
                    <MyGap jarak={20} />
                    <MyButton onPress={sendToServer} Icons="save-outline" title="Simpan Customer" warna={colors.primary} />

                </View>
            </ScrollView>}


            {open2 && <ScrollView style={{
                flex: 0.5,
                padding: 10,
                borderTopLeftRadius: 20,
                elevation: 4,

                borderTopRightRadius: 20,
                backgroundColor: colors.white
            }}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 15,
                        }}>Edit Customer</Text>
                    </View>

                    <TouchableOpacity onPress={() => setOpen2(false)} style={{

                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Icon type='ionicon' name='close' size={35} />
                    </TouchableOpacity>
                </View>
                <View>
                    <MyInput value={kirim.nama_customer} onChangeText={x => setKirim({
                        ...kirim,
                        nama_customer: x
                    })} autoFocus label="Nama Customer" iconname="card" />
                    <MyGap jarak={10} />
                    <MyInput value={kirim.telepon_customer} onChangeText={x => setKirim({
                        ...kirim,
                        telepon_customer: x
                    })} label="Telepon Customer" keyboardType="phone-pad" iconname="call" />
                    <MyGap jarak={20} />
                    <MyInput value={kirim.alamat_customer} onChangeText={x => setKirim({
                        ...kirim,
                        alamat_customer: x
                    })} label="Alamat" iconname="location" />
                    <MyGap jarak={20} />
                    <MyInput value={kirim.keterangan_customer} onChangeText={x => setKirim({
                        ...kirim,
                        keterangan_customer: x
                    })} label="Keterangan" iconname="create" />
                    <MyGap jarak={20} />
                    <MyButton onPress={sendToServer2} Icons="save-outline" title="Update Customer" warna={colors.primary} />

                </View>
            </ScrollView>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})