import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { MyButton, MyGap, MyInput } from '../../components'
import { colors } from '../../utils/colors'
import { Icon } from 'react-native-elements'
import { fonts } from '../../utils/fonts'
import { getData, storeData, urlAPI, urlAPINEW } from '../../utils/localStorage'
import axios from 'axios'
import { showMessage } from 'react-native-flash-message'

export default function CustomerEdit({ navigation, route }) {

    const [item, setItem] = useState(route.params);

    useEffect(() => {
        getDataCustomer()
    }, [])



    const [loading, setLoading] = useState(true);


    const [data, setData] = useState([]);
    const [tmp, setTmp] = useState([]);



    const getDataCustomer = () => {


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
                }}>{item.nama_customer}</Text></Text>
            </View>
            {loading && <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>}
            <ScrollView style={{
                flex: 1,
            }}>


                {!loading && data.map(i => {
                    return (
                        <View style={{
                            marginHorizontal: 10,
                            marginVertical: 5,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: item.nama_customer == i.nama_customer ? colors.success : colors.black,
                            padding: 10,
                            flexDirection: 'row',
                            marginBottom: 5,
                        }}>

                            <View style={{
                                flex: 1
                            }}>
                                <Text style={{
                                    flex: 1,
                                    color: item.nama_customer == i.nama_customer ? colors.success : colors.black,
                                    fontFamily: fonts.secondary[600],
                                    fontSize: 16,
                                }}>{i.nama_customer}</Text>
                                <Text style={{
                                    flex: 1,
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                }}>{i.telepon_customer}</Text>
                                <Text style={{
                                    flex: 1,
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                }}>{i.alamat_customer}</Text>
                                <Text style={{
                                    flex: 1,
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                }}>{i.keterangan_customer}</Text>
                            </View>



                            {item.fid_customer != i.id && <TouchableOpacity style={{
                                marginHorizontal: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} onPress={() => {
                                Alert.alert(
                                    `${i.nama_customer}`,
                                    `Pilih customer ini ?`,
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        {
                                            text: "OK", onPress: () => {

                                                setItem({
                                                    ...item,
                                                    fid_customer: i.id,
                                                    nama_customer: i.nama_customer
                                                });

                                                axios.post(urlAPINEW + 'edit_customer', {
                                                    fid_customer: i.id,
                                                    kode: item.kode
                                                }).then(res => {
                                                    console.log(res.data);
                                                })

                                                showMessage({
                                                    message: `${i.nama_customer} berhasil dipilih`,
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


                            {/* {item.fid_customer == i.id && <TouchableOpacity style={{
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
                            </TouchableOpacity>} */}



                        </View>

                    );
                })}
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})