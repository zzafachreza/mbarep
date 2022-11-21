import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { urlAPI } from '../../utils/localStorage';
import { MyButton, MyGap } from '../../components';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
export default function ListDetail({ navigation, route }) {
  const [item, setItem] = useState(route.params);
  navigation.setOptions({ title: 'Detail Pesanan' });
  const [data, setData] = useState(route.params);
  const [buka, setBuka] = useState(true);
  const [dataDetail, setDataDetail] = useState([]);
  const [link, setLink] = useState('');
  const ref = useRef();
  useEffect(() => {
    DataDetail();
    ref.current.capture().then(uri => {
      console.log("do something with ", uri);
      setLink(uri);
    });

  }, []);
  let nama_icon = '';

  if (data.status == "DONE") {
    nama_icon = 'checkmark-circle-outline';
  } else {
    nama_icon = 'close-circle-outline';
  }



  const DataDetail = () => {
    axios
      .post(urlAPI + '/transaksi_detail.php', {
        kode: item.kode,
      })
      .then(res => {
        console.warn('detail transaksi', res.data);
        setDataDetail(res.data);
        setBuka(true);
      });
  }



  return (

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white
      }}>

      {!buka && <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>}
      {buka &&
        <ViewShot style={{
          flex: 1,
        }} ref={ref} options={{ fileName: item.kode, format: "jpg", quality: 0.9 }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 10, }}>

            {item.status !== 'PENDING' && (
              <View style={{
                backgroundColor: colors.white,
                marginVertical: 1,
              }}>

                <View style={{
                  flexDirection: 'row'
                }}>
                  {/* <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.secondary[600],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }}>
                  {item.status}
                </Text> */}


                </View>

                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>
                  {item.kode}
                </Text>
                <View style={{
                  flexDirection: 'row'
                }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: fonts.secondary[400],
                      padding: 10,
                      fontSize: windowWidth / 30,
                      color: colors.black,

                    }}>
                    Customer
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.secondary[400],
                      padding: 10,
                      fontSize: windowWidth / 30,
                      color: colors.black,

                    }}>
                    {item.nama_customer} /  {item.telepon_customer}
                  </Text>
                </View>
                <View style={{
                  flexDirection: 'row'
                }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: fonts.secondary[400],
                      padding: 10,
                      fontSize: windowWidth / 30,
                      color: colors.black,

                    }}>
                    Tanggal Pembelian
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.secondary[400],
                      padding: 10,
                      fontSize: windowWidth / 30,
                      color: colors.black,

                    }}>
                    {item.tanggal}, {item.jam} WIB
                  </Text>
                </View>
              </View>

            )}
            <View style={{
              backgroundColor: colors.white,
              marginVertical: 1,
            }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  padding: 10,
                  fontSize: windowWidth / 30,
                  color: colors.black,
                }}>
                Detail Produk
              </Text>

              {dataDetail.map(i => {
                return (
                  <View style={{
                    flexDirection: 'row',
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border_list,
                  }}>


                    <View style={{
                      flex: 1,
                      justifyContent: 'center'
                    }}>
                      <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: windowWidth / 35,
                        color: colors.black,
                      }}>{i.nama_barang}</Text>
                      <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: windowWidth / 35,
                        color: colors.black,
                      }}>{new Intl.NumberFormat().format(i.harga)} x {new Intl.NumberFormat().format(i.qty)} <Text style={{
                        fontFamily: fonts.secondary[600],
                        color: colors.primary,
                      }}>{i.uom}</Text></Text>
                      <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: windowWidth / 35,
                        color: colors.black,
                        fontStyle: 'italic'
                      }}>{i.note}</Text>

                    </View>

                    <View style={{
                      justifyContent: 'center'
                    }}>
                      <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: windowWidth / 25,
                        color: colors.black,
                        paddingHorizontal: 10,
                        borderRadius: 5,

                      }}>Rp. {new Intl.NumberFormat().format(i.harga * i.qty)}</Text>
                    </View>
                  </View>
                )
              })}
            </View>

            <View style={{
              backgroundColor: colors.white,
              marginVertical: 1,
              paddingBottom: 20,
            }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  padding: 10,
                  fontSize: windowWidth / 30,
                  color: colors.black,
                }}>
                Total Transaksi
              </Text>
              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20,
                color: colors.black,
                paddingHorizontal: 10,
                textAlign: 'center',
                borderRadius: 5,

              }}>Rp. {new Intl.NumberFormat().format(item.harga_total)}</Text>

            </View>


            <MyGap jarak={10} />

            {item.status == 'SUDAH DIKIRIM' && (<MyButton onPress={() => {
              axios.post(urlAPI + '/1transaksi_selesai.php', {
                kode: item.kode
              }).then(res => {
                console.log(res);
                setItem({
                  ...item,
                  status: 'SELESAI'
                })

              })
            }} title='Pesanan Selesai' warna={colors.primary} colorText={colors.white} Icons="checkmark-circle" iconColor={colors.white} />)}





            <MyGap jarak={20} />
          </ScrollView>
        </ViewShot>
      }

      <View style={{
        padding: 10
      }}>
        <MyButton onPress={() => {
          // alert(link);
          // Linking.openURL(link)

          Share.open({
            url: link
          }).then((res) => {
            console.log(res);
          }).catch((err) => {
            err && console.log(err);
          });

        }} title='Share Pesanan' warna={colors.primary} colorText={colors.white} Icons="share-social-outline" iconColor={colors.white} />
      </View>
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.primary,

    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    height: 80,
    margin: 5,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    textAlign: 'center',
  },
  date: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    textAlign: 'center',
  },
});
