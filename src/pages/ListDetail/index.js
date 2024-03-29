import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  Modal,
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
import * as htmlToImage from 'html-to-image';
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
import { MyButton, MyCalendar, MyGap } from '../../components';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import { useIsFocused } from '@react-navigation/native';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';

import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from "react-native-thermal-receipt-printer";
import { Alert } from 'react-native';
import moment from 'moment';


export default function ListDetail({ navigation, route }) {
  const isFocused = useIsFocused();

  const [paired, setPaired] = useState({
    device_name: '',
    inner_mac_address: ''
  });
  const [modalVisible, setModalVisible] = useState(false);

  const [item, setItem] = useState(route.params);
  navigation.setOptions({ title: 'Detail Pesanan' });
  const [data, setData] = useState(route.params);
  const [buka, setBuka] = useState(true);
  const [dataDetail, setDataDetail] = useState([]);
  const [link, setLink] = useState('');
  const ref = useRef();
  const [foundDs, setFoundDs] = useState([]);

  const [printer, setPrinter] = useState({});


  useEffect(() => {



    getPrinter();

    if (isFocused) {
      DataDetail();
    }

  }, [isFocused]);
  let nama_icon = '';

  if (data.status == "DONE") {
    nama_icon = 'checkmark-circle-outline';
  } else {
    nama_icon = 'close-circle-outline';
  }


  const [tgl, setTgl] = useState(moment(route.params.tanggal).format('YYYY-MM-DD'));


  const getPrinter = () => {

    BluetoothManager.isBluetoothEnabled().then((enabled) => {
      if (!enabled) {
        // Alert.alert('Mbarep Group', 'Aktfikan Bluetooth untuk print !');
      } else {

        getData('paired').then(res => {
          if (!res) {
            setPaired({
              device_name: '',
              inner_mac_address: ''
            });
            Alert.alert('Mbarep Group', 'Silahkan pilih printer yang tersedia', [
              {
                text: 'Pilih',
                onPress: () => navigation.navigate('PrinterBluetooth')
              }
            ])
          } else {
            setPaired(res)
          }
        })
      }
    });


  }


  const [hutang, setHutang] = useState({});
  const [dataHutang, setDatahutang] = useState([]);

  const DataDetail = () => {

    axios
      .post(urlAPINEW + 'transaksi_header', {
        kode: item.kode,
      })
      .then(res => {

        axios.post(urlAPINEW + 'hutang_data', {
          kode: item.kode
        }).then(hh => {
          console.log('data hutang', hh.data);
          setDatahutang(hh.data)

        })


        // console.log('header', res.data.status)
        setItem(res.data);
        if (res.data.status == "BELUM LUNAS") {
          axios.post(urlAPINEW + 'cek_hutang', {
            kode: item.kode
          }).then(hh => {

            setHutang(hh.data)
          })
        }
        // setBuka(true);
      });


    axios
      .post(urlAPI + '/transaksi_detail.php', {
        kode: item.kode,
      })
      .then(res => {
        ref.current.capture().then(uri => {
          console.log("do something with ", uri);
          setLink(uri);
        });
        // console.log('detail', res.data)
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
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 10, }}>
          <ViewShot style={{
            flex: 1,
            backgroundColor: '#FFFFFF'
          }} ref={ref} options={{ fileName: item.kode, format: "jpg", quality: 0.9, }}>


            {item.status !== 'PENDING' && (
              <View style={{
                backgroundColor: colors.white,
                marginVertical: 1,
              }}>

                <View style={{
                  flexDirection: 'row'
                }}>
                  <Text
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
                  </Text>

                  {item.status !== 'BATAL' && <TouchableOpacity onPress={() => {
                    Alert.alert('Batalkan Pesanan', 'Apakah kamu yakin akan membatalkan pesanan ini ? stok akan bertambah kembali', [
                      { text: 'TIDAK' },
                      {
                        text: 'BATALKAN PESANAN', onPress: () => {
                          axios.post(urlAPINEW + 'transaksi_cancel', {
                            kode: item.kode
                          }).then(res => {
                            console.log(res.data);
                            DataDetail();
                          })
                        }
                      }
                    ])
                  }} style={{
                    padding: 10,
                    borderRadius: 20,
                    backgroundColor: colors.danger
                  }}><Text style={{ fontFamily: fonts.secondary[600], color: colors.white, textAlign: 'center' }}>Batalkan Pesanan</Text></TouchableOpacity>}

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
                    Customer <TouchableOpacity onPress={() => {
                      navigation.navigate('CustomerEdit', item)
                    }} style={{
                      width: 60,
                      borderRadius: 20,
                      backgroundColor: colors.primary
                    }}><Text style={{ fontFamily: fonts.secondary[600], color: colors.white, textAlign: 'center' }}>Edit</Text></TouchableOpacity>
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
                    Tanggal Pembelian  <TouchableOpacity onPress={() => {

                      setModalVisible(true);


                    }} style={{
                      width: 60,
                      borderRadius: 20,
                      backgroundColor: colors.black
                    }}><Text style={{ fontFamily: fonts.secondary[600], color: colors.white, textAlign: 'center' }}>Edit</Text></TouchableOpacity>
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
                    Catatan Pembelian
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.secondary[200],
                      padding: 10,
                      fontSize: windowWidth / 30,
                      color: colors.black,

                    }}>
                    {item.catatan}
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
                        color: i.retur > 0 ? colors.border : colors.black
                      }}>{i.nama_barang}</Text>
                      <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: windowWidth / 35,
                        color: i.retur > 0 ? colors.border : colors.black
                      }}>{new Intl.NumberFormat().format(i.harga_dasar)} x {new Intl.NumberFormat().format(i.qty)} <Text style={{
                        fontFamily: fonts.secondary[600],
                        color: i.retur > 0 ? colors.border : colors.primary
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
                      {i.diskon > 0 && <Text
                        style={{
                          fontFamily: fonts.secondary[400],
                          fontSize: windowWidth / 35,
                          color: colors.danger,
                          textAlign: 'right'

                        }}>
                        - {new Intl.NumberFormat().format(parseFloat(i.diskon_total))}
                      </Text>}
                      <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: windowWidth / 25,
                        color: i.retur > 0 ? colors.border : colors.black,

                      }}>Rp. {new Intl.NumberFormat().format(i.total)}</Text>

                    </View>

                    {i.retur == 0 && <TouchableOpacity onPress={() => {
                      Alert.alert('Mbarep Group', `Apakah kamu yakin akan retur ${i.nama_barang} sebanyak ${i.qty} ${i.uom} ?`, [
                        {
                          text: 'BATAL',
                        },
                        {
                          text: 'RETUR',
                          onPress: () => {
                            const rtr = {
                              fid_kode: i.kode,
                              fid_barang: i.fid_barang,
                              total: i.total,
                              uom: i.uom,
                              qty: i.qty,
                              nama_barang: i.nama_barang,
                              qty_jual: i.qty_jual,
                              nama_customer: item.nama_customer,
                              telepon_customer: item.telepon_customer,


                            }

                            console.log(rtr);
                            axios.post(urlAPI + '/1add_retur.php', rtr).then(rs => {
                              console.log(rs.data);

                              DataDetail();
                            })
                          }
                        }
                      ])
                    }} style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 5,
                      marginLeft: 10,
                      borderRadius: 10,
                      backgroundColor: colors.warning
                    }}>
                      <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: windowWidth / 35,
                        color: colors.white,

                      }}>Retur</Text>
                    </TouchableOpacity>}

                    {i.retur > 0 && <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 5,
                      marginLeft: 10,
                      borderRadius: 10,
                    }}>
                      <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: windowWidth / 35,
                        color: colors.border,

                      }}>Retur</Text>
                    </View>}
                  </View>
                )
              })}
            </View>

            <View style={{
              flexDirection: 'row',
              marginHorizontal: 10,
            }}>
              <Text style={{
                flex: 1,
                fontFamily: fonts.secondary[400],
                fontSize: windowWidth / 25
              }}>
                Total
              </Text>
              <Text style={{
                textAlign: 'center',
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 22
              }}>
                Rp. {new Intl.NumberFormat().format(item.beli_total)}
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              marginHorizontal: 10,
            }}>
              <Text style={{
                flex: 1,
                fontFamily: fonts.secondary[400],
                fontSize: windowWidth / 25
              }}>
                Total Diskon
              </Text>
              <Text style={{
                textAlign: 'center',
                fontFamily: fonts.secondary[400],
                fontSize: windowWidth / 22
              }}>
                -Rp. {new Intl.NumberFormat().format(item.diskon_total)}
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              marginHorizontal: 10,
            }}>
              <Text style={{
                flex: 1,
                fontFamily: fonts.secondary[400],
                fontSize: windowWidth / 25
              }}>
                Total Transaksi
              </Text>
              <Text style={{
                textAlign: 'center',
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20
              }}>
                Rp. {new Intl.NumberFormat().format(item.beli_total - item.diskon_total)}
              </Text>
            </View>

            <View style={{
              margin: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors.primary,
              padding: 10,
            }}>
              <Text style={{
                fontFamily: fonts.secondary[800],
                fontSize: windowWidth / 25,
                color: colors.primary,
              }}>
                Riwayat Bayar
              </Text>

              <View>
                {dataHutang.length > 0 && dataHutang.map(i => {
                  return (
                    <View style={{
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border_list
                    }}>
                      <Text style={{
                        flex: 1,
                        fontFamily: fonts.secondary[400],
                        fontSize: 14,
                        marginVertical: 5,
                      }}>
                        {moment(i.tanggal).format('YYYY-MM-DD')}
                      </Text>
                      <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 14,
                        marginVertical: 5,
                        color: colors.black
                      }}>
                        Rp. {new Intl.NumberFormat().format(i.total)}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </View>

            {item.status == 'BELUM LUNAS' && <View style={{
              marginTop: 10,
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              borderColor: colors.border_list
            }}>
              <View style={{
                flexDirection: 'row',
                marginHorizontal: 10,
              }}>
                <Text style={{
                  flex: 1,
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 25
                }}>
                  Sudah Bayar
                </Text>
                <Text style={{
                  textAlign: 'center',
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 25,
                  color: colors.success
                }}>
                  Rp. {new Intl.NumberFormat().format(item.bayar)}
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                marginHorizontal: 10,
              }}>
                <Text style={{
                  flex: 1,
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 25
                }}>
                  Sisa
                </Text>
                <Text style={{
                  textAlign: 'center',
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 25,
                  color: colors.danger
                }}>
                  Rp. {new Intl.NumberFormat().format((item.beli_total - item.diskon_total) - hutang.total)}
                </Text>
              </View>
              <MyGap jarak={10} />
              <View style={{
                paddingHorizontal: 10,
              }}>
                <MyButton onPress={() => navigation.navigate('BayarPiutang', {
                  kode: item.kode,
                  status: item.status,
                  total: item.harga_total,
                  bayar: item.bayar,
                  sisa: hutang.total
                })} warna={colors.success} title="Bayar Sisa Hutang" Icons="download-outline" />
              </View>
            </View>}


            <MyGap jarak={10} />
            {/* 
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
            }} title='Pesanan Selesai' warna={colors.primary} colorText={colors.white} Icons="checkmark-circle" iconColor={colors.white} />)} */}





            <MyGap jarak={20} />

          </ViewShot>
        </ScrollView>
      }

      <View style={{
        padding: 10,
        flexDirection: 'row'
      }}>
        <View style={{
          flex: 1,
          paddingRight: 10,
        }}>
          <MyButton onPress={async () => {



            Linking.openURL(link)

            Share.open({
              url: link
            }).then((res) => {
              console.log(res);
            }).catch((err) => {
              err && console.log(err);
            });

          }} title='Share Pesanan' warna={colors.primary} colorText={colors.white} Icons="share-social-outline" iconColor={colors.white} />
        </View>
        <View style={{
          flex: 1,
          paddingLeft: 10,
        }}>
          <MyButton onPress={async () => {
            BluetoothManager.connect(paired.inner_mac_address)
              .then(async (s) => {
                console.log(s);




                let columnWidths = [8, 20, 20];
                try {
                  await BluetoothEscposPrinter.printText('\r\n', {});
                  // await BluetoothEscposPrinter.printPic(logoCetak, { width: 250, left: 150 });
                  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                  await BluetoothEscposPrinter.printColumn(
                    [15],
                    [BluetoothEscposPrinter.ALIGN.CENTER],
                    ['MBAREP GROUP'],
                    {
                      encoding: 'GBK',
                      codepage: 0,
                      widthtimes: 2,
                      heigthtimes: 1,
                      fonttype: 1
                    },
                  );
                  await BluetoothEscposPrinter.printColumn(
                    [32],
                    [BluetoothEscposPrinter.ALIGN.CENTER],
                    ['Dusun krajan, Desa Patik'],
                    {},
                  );
                  await BluetoothEscposPrinter.printColumn(
                    [32],
                    [BluetoothEscposPrinter.ALIGN.CENTER],
                    ['Ponorogo Jatim'],
                    {},
                  );
                  await BluetoothEscposPrinter.printColumn(
                    [32],
                    [BluetoothEscposPrinter.ALIGN.CENTER],
                    ['Tlp +62 8233 4520 235'],
                    {},
                  );
                  await BluetoothEscposPrinter.printText(
                    '-------------------------------\r\n',
                    {},
                  );
                  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                  await BluetoothEscposPrinter.printText(
                    `${item.tanggal} ${item.jam} WIB\r\n`,
                    {},
                  );
                  await BluetoothEscposPrinter.printColumn(
                    [15, 17],
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                    ['No. Transaksi', `${item.kode}`],
                    {},
                  );
                  await BluetoothEscposPrinter.printColumn(
                    [15, 17],
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                    ['Customer', `${item.nama_customer}`],
                    {},
                  );
                  await BluetoothEscposPrinter.printText(
                    '-------------------------------\r\n',
                    {},
                  );

                  // loopiong

                  dataDetail.map(i => {
                    BluetoothEscposPrinter.printColumn(
                      [15, 17],
                      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                      [`${i.nama_barang}`, `Rp. ${new Intl.NumberFormat().format(i.total)}`],
                      {},
                    );
                    BluetoothEscposPrinter.printColumn(
                      [23, 12],
                      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                      [`${new Intl.NumberFormat().format(i.harga_dasar)} x ${i.qty} ${i.uom}`,
                      i.diskon > 0 ? `- ${new Intl.NumberFormat().format(i.diskon_total)}` : ``
                      ],
                      {
                        fonttype: 3,
                      },
                    );
                  })

                  await BluetoothEscposPrinter.printText(
                    '-------------------------------\r\n',
                    {},
                  );
                  await BluetoothEscposPrinter.printColumn(
                    [15, 17],
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                    ['Total', `Rp. ${new Intl.NumberFormat().format(item.beli_total)}`],
                    {},
                  );
                  await BluetoothEscposPrinter.printColumn(
                    [15, 17],
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                    ['Diskon', `Rp. ${new Intl.NumberFormat().format(item.diskon_total)}`],
                    {},
                  );
                  await BluetoothEscposPrinter.printColumn(
                    [15, 17],
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                    ['Transaksi', `Rp. ${new Intl.NumberFormat().format(item.harga_total)}`],
                    {},
                  );
                  await BluetoothEscposPrinter.printText(
                    '\r\n',
                    {},
                  );
                  await BluetoothEscposPrinter.printText(
                    '*Catatan\r\n',
                    {},
                  );
                  await BluetoothEscposPrinter.printText(
                    `${item.catatan}\r\n`,
                    {},
                  );
                  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                  // await BluetoothEscposPrinter.printQRCode(
                  //   `${item.kode}}`,
                  //   280,
                  //   BluetoothEscposPrinter.ERROR_CORRECTION.L,
                  // );

                  await BluetoothEscposPrinter.printText(
                    '\r\n\r\n',
                    {},
                  );

                  // loopiong


                  // await BluetoothEscposPrinter.printColumn(
                  //   [24, 24],
                  //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                  //   ['Packaging', 'Iya'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   [24, 24],
                  //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                  //   ['Delivery', 'Ambil Sendiri'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printText(
                  //   '================================================',
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printText('Products\r\n', {widthtimes: 1 });
                  // await BluetoothEscposPrinter.printText(
                  //   '================================================',
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   columnWidths,
                  //   [
                  //     BluetoothEscposPrinter.ALIGN.LEFT,
                  //     BluetoothEscposPrinter.ALIGN.LEFT,
                  //     BluetoothEscposPrinter.ALIGN.RIGHT,
                  //   ],
                  //   ['1x', 'Cumi-Cumi', 'Rp.200.000'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   columnWidths,
                  //   [
                  //     BluetoothEscposPrinter.ALIGN.LEFT,
                  //     BluetoothEscposPrinter.ALIGN.LEFT,
                  //     BluetoothEscposPrinter.ALIGN.RIGHT,
                  //   ],
                  //   ['1x', 'Tongkol Kering', 'Rp.300.000'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   columnWidths,
                  //   [
                  //     BluetoothEscposPrinter.ALIGN.LEFT,
                  //     BluetoothEscposPrinter.ALIGN.LEFT,
                  //     BluetoothEscposPrinter.ALIGN.RIGHT,
                  //   ],
                  //   ['1x', 'Ikan Tuna', 'Rp.400.000'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printText(
                  //   '================================================',
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   [24, 24],
                  //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                  //   ['Subtotal', 'Rp.900.000'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   [24, 24],
                  //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                  //   ['Packaging', 'Rp.6.000'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   [24, 24],
                  //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                  //   ['Delivery', 'Rp.0'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printText(
                  //   '================================================',
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   [24, 24],
                  //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                  //   ['Total', 'Rp.906.000'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printText('\r\n\r\n', { });
                  // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                  // await BluetoothEscposPrinter.printQRCode(
                  //   'DP0837849839',
                  //   280,
                  //   BluetoothEscposPrinter.ERROR_CORRECTION.L,
                  // );
                  // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                  // await BluetoothEscposPrinter.printColumn(
                  //   [48],
                  //   [BluetoothEscposPrinter.ALIGN.CENTER],
                  //   ['DP0837849839'],
                  //   {widthtimes: 2 },
                  // );
                  // await BluetoothEscposPrinter.printText(
                  //   '================================================',
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printColumn(
                  //   [48],
                  //   [BluetoothEscposPrinter.ALIGN.CENTER],
                  //   ['Sabtu, 18 Juni 2022 - 06:00 WIB'],
                  //   { },
                  // );
                  // await BluetoothEscposPrinter.printText(
                  //   '================================================',
                  //   { },
                  // );
                  await BluetoothEscposPrinter.printText('\r\n\r\n', {});
                } catch (e) {
                  alert(e.message || 'ERROR');
                }



              }, (e) => {

                alert(e);
              })

          }} title='Print Pesanan' warna={colors.danger} colorText={colors.white} Icons="print-outline" iconColor={colors.white} />
        </View>
      </View>
      {/* modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(!modalVisible);
        }}>
        <View style={{
          backgroundColor: colors.primary,
          flex: 1,
          justifyContent: 'center'
        }}>
          <View style={{
            marginHorizontal: 10,
            height: windowHeight / 4,
            backgroundColor: colors.white,
            padding: 20,
            borderRadius: 10,
          }}>
            <MyCalendar label="Tanggal" iconname="calendar" value={tgl} onDateChange={x => setTgl(x)} />
            <MyGap jarak={10} />
            <MyButton onPress={() => {
              setModalVisible(false);
              axios.post(urlAPI + '/1update_tanggal.php', {
                tanggal: tgl,
                kode: item.kode
              }).then(res => {
                setItem({
                  ...item,
                  tanggal: tgl
                });

                alert('Transaksi Berhasil di update !')
                console.log(res.data)
              })
            }} title="UPDATE TANGGAL" warna={colors.black} />
          </View>
        </View>
      </Modal>
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
