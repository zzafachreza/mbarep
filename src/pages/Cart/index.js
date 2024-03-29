import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';

import { getData, storeData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyGap, MyInput, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Modalize } from 'react-native-modalize';

export default function Cart({ navigation, route }) {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [buka, setbuka] = useState(true);
  const [tipe, setTipe] = useState(false);
  const [jenis, setJenis] = useState('DI ANTAR KE BANK SAMPAH');
  const [alamat, setAlamat] = useState('');
  const [loading, setLoading] = useState(false);
  const [jumlah, setJumlah] = useState(1);
  const [itemz, setItem] = useState({});
  const [modal, setModal] = useState(false);

  const modalizeRef = useRef();

  const updateCart = () => {
    console.log(itemz);

    axios.post(urlAPI + '/cart_update.php', {
      id_cart: itemz.id,
      qty: itemz.qty,
      total: itemz.total,
      diskon_total: 0,
    }).then(x => {
      modalizeRef.current.close();
      getData('user').then(tkn => {
        __getDataBarang(tkn.id);
      });
      getData('cart').then(xx => {
        storeData('cart', xx - 1)
      });
    })

  }

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const isFocused = useIsFocused();
  //   useEffect(() => {

  //   }, []);

  useEffect(() => {
    if (isFocused) {

      getData('user').then(rx => {
        // console.log(rx)
        setUser(rx);
        __getDataBarang(rx.id);
      });

    }
  }, [isFocused]);

  const kirimServer = () => {
    setLoading(true);

    getData('user').then(res => {

      const dd = {
        fid_user: res.id,
        harga_total: sub,
        bayar: sub,
        berat_total: beratTotal,
        diskon_total: 0,
        status: 'LUNAS'
      }

      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Checkout', dd)
      }, 1500)


      // console.log(dd);
      // axios.post(urlAPI + '/1add_transaksi.php', dd).then(rr => {
      //   console.log(rr.data);
      //   setTimeout(() => {
      //     setLoading(false);
      //     showMessage({
      //       type: 'success',
      //       message: 'Transaksi kamu berhasil dikirim'
      //     })
      //     navigation.replace('ListData')
      //   }, 1500)
      // })


    });
  }


  const kirimServer2 = () => {
    setLoading(true);

    getData('user').then(res => {

      const dd = {
        fid_user: res.id,
        harga_total: sub,
        berat_total: beratTotal
      }




      console.log(dd);
      axios.post(urlAPI + '/1add_transaksi2.php', dd).then(rr => {
        console.log(rr.data);
        setTimeout(() => {
          setLoading(false);
          showMessage({
            type: 'success',
            message: 'Transaksi kamu berhasil dikirim'
          })
          navigation.replace('ListData2')
        }, 1500)
      })


    });
  }

  const __getDataBarang = (zz) => {
    axios.post(urlAPI + '/cart.php', {
      fid_user: zz
    }).then(x => {
      setData(x.data);
    })

  }

  const hanldeHapus = (x) => {
    axios.post(urlAPI + '/cart_hapus.php', {
      id_cart: x
    }).then(x => {
      getData('user').then(tkn => {
        __getDataBarang(tkn.id);
      });
      getData('cart').then(xx => {
        storeData('cart', xx - 1)
      });
    })
  };




  var sub = 0;
  var beratTotal = 0;
  data.map((item, key) => {
    sub += parseFloat(item.total);
    beratTotal += parseFloat(item.berat);
  });

  const __renderItem = ({ item, index }) => {
    return (

      <View style={{
        backgroundColor: colors.background1,
        marginVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: colors.zavalabs,
        paddingBottom: 5,
      }}>
        <View
          style={{

            padding: 10,
            flexDirection: 'row'
          }}>
          <View style={{
            paddingHorizontal: 10,
          }}>
            <Image style={{
              width: 50, height: 50,
              borderRadius: 5,
            }} source={{
              uri: item.image
            }} />
          </View>

          <View style={{ flex: 1, justifyContent: 'center' }}>

            <Text
              style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 30,
                color: colors.textPrimary
              }}>
              {item.nama_barang}
            </Text>




            <Text
              style={{
                fontFamily: fonts.secondary[400],
                flex: 1,
                fontSize: windowWidth / 33,
                color: colors.black
              }}>
              {new Intl.NumberFormat().format(item.harga_dasar)} x {item.qty} {item.uom}

              {item.diskon > 0 && <Text style={{

                fontFamily: fonts.secondary[600],
                color: colors.success
              }}> {item.diskon}% </Text>}
            </Text>

            <View style={{
              flexDirection: 'row'
            }}>
              <View>
                {item.diskon > 0 && <View style={{
                  flexDirection: 'row'
                }}>
                  {/* <Text
                    style={{
                      fontFamily: fonts.secondary[400],
                      textDecorationLine: "line-through",
                      textDecorationStyle: "solid",
                      fontSize: windowWidth / 33,
                      color: colors.black,

                    }}>
                    {new Intl.NumberFormat().format(parseFloat(item.total) + parseFloat(item.diskon_peritem))}

                  </Text> */}

                </View>}
                <Text
                  style={{
                    right: 5,
                    fontFamily: fonts.secondary[600],
                    fontSize: windowWidth / 25,
                    color: colors.black,
                  }}>
                  Rp. {new Intl.NumberFormat().format(item.total)}
                </Text>

              </View>
              <TouchableOpacity onPress={() => {
                setItem(item);
                setModal(true);
              }}>
                <Icon type="ionicon" name="create" color={colors.warning} size={15} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
                flex: 1,
                fontStyle: "italic",
                fontSize: windowWidth / 35,
                color: colors.border
              }}>
              {item.note}
            </Text>
          </View>

          <View
            style={{
              // justifyContent: 'flex-end',
              // alignItems: 'flex-end',
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                color: colors.white,
                borderRadius: 5,
                backgroundColor: colors.primary,
                paddingHorizontal: 10,
                fontSize: windowWidth / 25,
                textAlign: 'center'
              }}>
              {item.uom}
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}>

              <TouchableOpacity
                onPress={() => {
                  setItem(item);
                  modalizeRef.current.open();
                }}
                style={{
                  marginHorizontal: 5,
                }}>
                <Icon type='ionicon' name='create' color={colors.secondary} />
              </TouchableOpacity>


              <TouchableOpacity onPress={() => {


                Alert.alert(
                  "Apakah kamu yakin akan menghapus ini ?",
                  item.nama_barang,
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => hanldeHapus(item.id) }
                  ]
                );

              }} style={{
                marginHorizontal: 5,
              }}>
                <Icon type='ionicon' name='trash' color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View >

    );
  };


  const [foto, setfoto] = useState('https://zavalabs.com/nogambar.jpg');

  const options = {
    includeBase64: true,
    quality: 0.3,
  };



  return (
    <SafeAreaView
      style={{
        flex: 1,
        // padding: 10,
        backgroundColor: colors.background1,
      }}>

      <FlatList data={data} renderItem={__renderItem} />

      <Text style={{
        textAlign: 'center',
        fontFamily: fonts.secondary[600],
        fontSize: windowWidth / 20
      }}>Rp. {new Intl.NumberFormat().format(parseFloat(sub))}</Text>

      <Modalize
        withHandle={false}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        snapPoint={windowHeight / 3.4}
        HeaderComponent={
          <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: windowWidth / 35,
                    color: colors.black,
                  }}>
                  {itemz.nama_barang}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: 20,
                    color: colors.black,
                  }}>
                  Rp. {new Intl.NumberFormat().format(itemz.harga * itemz.qty)}

                </Text>
              </View>
              <TouchableOpacity onPress={() => modalizeRef.current.close()}>
                <Icon type="ionicon" name="close-outline" size={35} />
              </TouchableOpacity>
            </View>
          </View>
        }

        ref={modalizeRef}>
        <View style={{ flex: 1, height: windowWidth / 3 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 1, padding: 10, }}>
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    color: colors.black,
                  }}>
                  Jumlah
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'flex-end'
                }}>
                <TouchableOpacity
                  onPress={() => {
                    itemz.qty == 1
                      ? showMessage({
                        type: 'danger',
                        message: 'Minimal pembelian 1',
                      })
                      : setItem({
                        ...itemz,
                        qty: itemz.qty - 1,
                        total: itemz.harga * (itemz.qty - 1)
                      });
                  }}
                  style={{
                    backgroundColor: colors.primary,
                    width: 80,
                    borderRadius: 10,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <Icon type="ionicon" name="remove" color={colors.white} />
                </TouchableOpacity>
                <View
                  style={{
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{ fontSize: 16, fontFamily: fonts.secondary[600] }}>
                    {itemz.qty}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setItem({
                      ...itemz,
                      qty: parseInt(itemz.qty) + 1,
                      total: itemz.harga * (parseInt(itemz.qty) + 1)
                    });
                  }}
                  style={{
                    backgroundColor: colors.primary,
                    width: 80,
                    borderRadius: 10,
                    marginLeft: 10,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon type="ionicon" name="add" color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>


            <View style={{ marginTop: 10, paddingHorizontal: 10, }}>
              <TouchableOpacity
                onPress={updateCart}
                style={{
                  backgroundColor: colors.secondary,
                  borderRadius: 10,
                  padding: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}>
                <Icon type='ionicon' name='create-outline' color={colors.white} />
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: windowWidth / 22,
                    color: colors.white,
                  }}>
                  SIMPAN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modalize>


      {loading && <View style={{
        padding: 10
      }}><ActivityIndicator size="large" color={colors.primary} /></View>}
      {!loading &&
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
          }}>


          {!modal && <View style={{
            flex: 1,
          }}>
            <MyButton warna={colors.primary} onPress={kirimServer} title={`CHECKOUT`} Icons="shield-checkmark-outline" />
          </View>}

        </View>}

      {modal && <View style={{
        position: 'absolute',
        marginTop: windowHeight / 8,
        width: windowWidth,
        padding: 20,
      }}>
        <View style={{
          flex: 1,
          padding: 10,
          backgroundColor: colors.zavalabs,
          borderRadius: 10,
        }}>
          <View style={{
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1,
              marginBottom: 10,
            }}>
              <Text style={{

                fontFamily: fonts.secondary[400],
                fontSize: windowWidth / 25,
                color: colors.black,
              }}>{itemz.nama_barang}</Text>
              <Text style={{
                flex: 1,
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20,
                color: colors.black,
              }}>Rp. {new Intl.NumberFormat().format(itemz.harga_dasar)}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setItem({});
              setModal(false);
            }}>
              <Icon type="ionicon" name="close-outline" size={windowWidth / 15} />
            </TouchableOpacity>
          </View>
          <View>
            <TextInput onChangeText={x => setItem({
              ...itemz,
              harga_dasar_baru: x
            })} placeholder='Update harga' autoFocus keyboardType='number-pad' style={{
              borderWidth: 1,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 20,
              borderColor: colors.primary,
              borderRadius: 10, textAlign: 'center'
            }} />
          </View>
          <MyGap jarak={20} />
          <MyButton onPress={() => {
            console.log(itemz);
            axios.post(urlAPI + '/cart_update_harga.php', itemz).then(res => {
              console.log(res.data);
              setModal(false);
              setItem({});
              getData('user').then(tkn => {
                __getDataBarang(tkn.id);
              });
            })
          }} title="Simpan Perubahan" warna={colors.primary} />
        </View>
      </View>}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
