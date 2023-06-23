import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { colors } from '../../utils/colors';
import { windowWidth, fonts, windowHeight } from '../../utils/fonts';
import { Icon } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import { Modalize } from 'react-native-modalize';
import { useIsFocused } from '@react-navigation/native';
import { MyButton } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
export default function ({ navigation, route }) {
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [show, setShow] = useState({
    variant: []
  });
  const [diskon, setdiskon] = useState({
    peritem: 0,
    total: 0,
    persen: 0,
  })
  const [jumlah, setJumlah] = useState(1);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myKey, setMykey] = useState('');

  // const key = route.params.key;

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   getDataBarang();
  //   wait(2000).then(() => setRefreshing(false));
  // }, []);
  var sub = 0;
  const [total, setTotal] = useState([]);
  useEffect(() => {
    if (isFocused) {
      __transaction();
    }
    getDataBarang();
  }, [isFocused]);

  const __transaction = () => {
    getData('user').then(res => {
      setUser(res);
      axios.post(urlAPI + '/cart.php', {
        fid_user: res.id
      }).then(x => {

        setTotal(x.data)
      })
    })
  }

  total.map((item, key) => {
    sub += parseFloat(item.total);

  })



  const addToCart = () => {
    const kirim = {
      fid_user: user.id,
      fid_barang: show.id,
      harga_dasar: show.harga_barang,
      diskon: diskon.persen,
      diskon_peritem: diskon.peritem,
      diskon_total: diskon.total,
      harga: (show.harga_barang * jumlah),
      uom: show.uom,
      qty: jumlah,
      qty_jual: show.uom.toUpperCase() == "PCS" ? jumlah : show.qty_jual * jumlah,
      total: (show.harga_barang * jumlah) - diskon.total
    };
    console.log('kirim tok server', kirim);
    axios
      .post(urlAPI + '/1add_cart.php', kirim)
      .then(res => {
        // console.log(res.data);

        __transaction();
        setJumlah(1)
        setdiskon({
          peritem: 0,
          total: 0,
          persen: 0,
        })
        // navigation.replace('MainApp');
        modalizeRef.current.close();
      });
  };

  const modalizeRef = useRef();

  const onOpen = () => {
    modalizeRef.current?.open();
  };







  const getDataBarang = (y, z = route.params.key == null ? '' : route.params.key) => {
    setLoading(true);

    getData('user').then(u => {

      axios.post(urlAPI + '/1data_barang.php', {
        key: z,
        key2: y,
        fid_user: u.id,
        level: u.level
      }).then(res => {
        setMykey('');
        console.log('data_barang', res.data);
        setLoading(false);
        setData(res.data);
      });
    })


  };

  const renderItem = ({ item }) => (
    <View style={{
      flexDirection: 'row',
      marginVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: colors.border_list
    }}>
      <View style={{
        flex: 1,
      }}>
        <Text
          style={{
            marginVertical: 2,
            fontSize: windowWidth / 30,
            color: colors.black,
            fontFamily: fonts.secondary[600],
          }}>
          {item.nama_barang}
        </Text>
        <Text
          style={{
            marginVertical: 2,
            fontSize: windowWidth / 30,
            color: colors.textSecondary,
            fontFamily: fonts.secondary[400],
          }}>
          {item.keterangan}
        </Text>
        <Text>Stok Sales : {item.stok_sales}</Text>
        <View style={{
          flexDirection: 'row',

        }}>
          <Text
            style={{
              marginVertical: 5,
              fontSize: windowWidth / 35,
              color: colors.white,
              paddingHorizontal: 5,
              backgroundColor: colors.primary,
              borderRadius: 3,
              marginHorizontal: 2,
              fontFamily: fonts.secondary[600],
            }}>
            {item.satuan}
          </Text>

          {item.variant.length > 0 &&

            item.variant.map(i => {
              return (

                <Text
                  style={{
                    marginVertical: 5,
                    fontSize: windowWidth / 35,
                    color: colors.white,
                    paddingHorizontal: 5,
                    backgroundColor: colors.primary,
                    borderRadius: 3,
                    marginHorizontal: 2,
                    fontFamily: fonts.secondary[600],
                  }}>
                  {i.satuan_variant}
                </Text>

              )
            })


          }









        </View>

        {/* price */}

        <View style={{
          flexDirection: 'row'
        }}>
          {item.diskon > 0 &&
            <Text
              style={{
                fontSize: windowWidth / 30,
                color: colors.border,
                marginRight: 2,
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
                fontFamily: fonts.secondary[600],
              }}>
              Rp. {new Intl.NumberFormat().format(item.harga_dasar)}
            </Text>
          }
          {item.diskon > 0 && <Text
            style={{
              fontSize: windowWidth / 35,
              padding: 5,
              maxWidth: '40%',
              margin: 2,
              borderRadius: 5,
              textAlign: 'center',
              alignSelf: 'flex-end',
              color: colors.white,
              backgroundColor: colors.secondary,
              fontFamily: fonts.secondary[600],
            }}>
            Disc {new Intl.NumberFormat().format(item.diskon)}%
          </Text>}
        </View>






        <Text
          style={{
            paddingLeft: 5,
            fontSize: windowWidth / 25,
            color: colors.price,
            fontFamily: fonts.secondary[600],
          }}>
          Rp. {new Intl.NumberFormat().format(item.harga_barang)}
          <TouchableOpacity onPress={() => {
            // console.log(item)
            navigation.navigate('BarangEdit', item)
          }}>
            <Icon type='ionicon' name='create' size={15} color={colors.danger} />
          </TouchableOpacity>
        </Text>



      </View>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Image source={{
          uri: item.image
        }} style={{
          width: 60,
          height: 60,
          resizeMode: 'contain'
        }} />

        <TouchableOpacity onPress={() => {
          // navigation.navigate('BarangDetail', item);
          setShow(item)
          modalizeRef.current.open();

        }} style={{
          width: 80,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: colors.primary,
          marginVertical: 20,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5,
        }}>
          <Text style={{
            fontSize: windowWidth / 30,
            color: colors.primary,
            fontFamily: fonts.secondary[600],
          }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <SafeAreaView

      style={{
        flex: 1,
        padding: 10,

        backgroundColor: colors.background1,
      }}>
      <View style={{
        position: 'relative',
        marginBottom: 10,
      }}>
        <TextInput value={myKey} autoCapitalize='none' onSubmitEditing={(x) => {
          console.warn(x.nativeEvent.text);
          setMykey(x.nativeEvent.text);
          getDataBarang(x.nativeEvent.text);
        }}
          onChangeText={x => setMykey(x)}
          placeholderTextColor={colors.border}
          placeholder='Masukan kata kunci' style={{
            fontFamily: fonts.secondary[400],
            color: colors.black,
            fontSize: windowWidth / 30,
            paddingLeft: 10,
            borderRadius: 5,
            backgroundColor: colors.background6

            // borderRadius: 10,
          }} />
        <View style={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}>
          <Icon type='ionicon' name='search-outline' color={colors.border} />
        </View>
      </View>





      <View style={{
        flex: 1,
      }}>


        {loading && <View style={{
          flex: 1,
          marginTop: '50%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color={colors.primary} /></View>}


        {!loading && <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />}

      </View>
      <View style={{
        // flex: 1,
      }}>

        {total.length > 0 && <MyButton warna={colors.primary} onPress={() => navigation.replace('Cart')} title={"Rp. " + new Intl.NumberFormat().format(sub) + " - KERANJANG"} Icons="shield-checkmark-outline" />}

      </View>
      <Modalize
        withHandle={false}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        snapPoint={windowHeight}
        HeaderComponent={
          <View style={{ padding: 10, backgroundColor: colors.background1, }}>
            <View style={{ flexDirection: 'row' }}>

              <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: windowWidth / 35,
                    color: colors.textPrimary,
                  }}>
                  {show.nama_barang}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: 20,
                    color: colors.textPrimary,
                  }}>
                  Rp. {new Intl.NumberFormat().format((show.harga_barang * jumlah) - diskon.total)}
                </Text>
              </View>


              <TouchableOpacity onPress={() => modalizeRef.current.close()}>
                <Icon type="ionicon" name="close-outline" size={35} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        }

        ref={modalizeRef}>
        <View style={{ flex: 1, height: windowWidth / 1.5, backgroundColor: colors.background1 }}>
          <View style={{ padding: 10, flex: 1 }}>

            {/* uom */}
            <View style={{
              flexDirection: 'row'
            }}>

              <TouchableOpacity onPress={() => {
                setShow({
                  ...show,
                  harga_barang: show.harga_barang_tmp,
                  uom: show.satuan,
                  qty_jual: jumlah
                })
              }} style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: show.satuan == show.uom ? colors.primary : colors.black,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginRight: 5,
              }}>
                <Text
                  style={{
                    fontSize: windowWidth / 30,
                    color: colors.black,
                    fontFamily: fonts.secondary[600],
                  }}>
                  {show.satuan}
                </Text>
                <Text style={{
                  fontSize: windowWidth / 40,
                  color: colors.black,
                  fontFamily: fonts.secondary[400],
                }}>
                  1 PCS / Rp. {new Intl.NumberFormat().format(show.harga_barang_tmp)}
                </Text>
              </TouchableOpacity>

              {show.variant.length > 0 &&

                show.variant.map(i => {
                  return (
                    <TouchableOpacity onPress={() => {
                      console.log(show.stok_sales + i.jumlah_variant)
                      if (parseInt(i.jumlah_variant) <= parseInt(show.stok_sales)) {

                        setShow({
                          ...show,
                          harga_barang: i.harga_variant,
                          uom: i.satuan_variant,
                          qty_jual: i.jumlah_variant
                        })
                      } else {
                        showMessage({
                          type: 'danger',
                          message: 'Maksimal ' + show.stok_sales + ' PCS',
                        })
                      }
                    }} style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: show.uom == i.satuan_variant ? colors.primary : colors.black,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginRight: 5,
                    }}>
                      <Text
                        style={{
                          fontSize: windowWidth / 30,
                          color: colors.black,
                          fontFamily: fonts.secondary[600],
                        }}>
                        {i.satuan_variant}
                      </Text>
                      <Text style={{
                        fontSize: windowWidth / 40,
                        color: colors.black,
                        fontFamily: fonts.secondary[400],
                      }}>
                        {i.jumlah_variant} PCS / Rp. Rp. {new Intl.NumberFormat().format(i.harga_variant)}
                      </Text>
                    </TouchableOpacity>
                  )
                })
              }
            </View>

            {/* Satuan */}


            <View style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'space-evenly'
            }}>

              <View style={{
                flex: 1,
              }}>
                <Text style={{
                  backgroundColor: colors.danger,
                  color: colors.white,
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 35,
                  textAlign: 'center'
                }}>PER ITEM</Text>
                <TextInput value={diskon.peritem.toString()} keyboardType='number-pad' style={{
                  fontFamily: fonts.secondary[600],
                  textAlign: 'center',
                  color: colors.black,
                  borderBottomWidth: 1,
                }} onChangeText={x => {
                  setdiskon({
                    ...diskon,
                    peritem: x,
                    persen: show.harga_barang / x,
                    total: x * jumlah
                  })
                }} />
              </View>
              <View style={{
                flex: 1,
                paddingHorizontal: 10,
              }}>
                <Text style={{
                  backgroundColor: colors.black,
                  color: colors.white,
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 35,
                  textAlign: 'center'
                }}>Total</Text>
                <TextInput value={diskon.total.toString()} onChangeText={x => {

                  setdiskon({
                    ...diskon,
                    total: x,
                    persen: (show.harga_barang * jumlah) / x,
                    peritem: x / jumlah
                  })
                }} keyboardType='number-pad' style={{
                  fontFamily: fonts.secondary[600],
                  textAlign: 'center',
                  color: colors.black,
                  borderBottomWidth: 1,
                }} />
              </View>
              <View style={{
                flex: 1,
              }}>
                <Text style={{
                  backgroundColor: colors.success,
                  color: colors.white,
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 35,
                  textAlign: 'center'
                }}>%</Text>
                <TextInput value={diskon.persen.toString()} onChangeText={x => {

                  setdiskon({
                    ...diskon,
                    persen: x,
                    peritem: show.harga_barang * (x / 100),
                    total: (show.harga_barang * jumlah) * (x / 100)
                  })
                }} keyboardType='number-pad' style={{
                  fontFamily: fonts.secondary[600],
                  textAlign: 'center',
                  color: colors.black,
                  borderBottomWidth: 1,
                }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    color: colors.textPrimary,
                  }}>
                  Jumlah
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',

                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    jumlah == 1
                      ? showMessage({
                        type: 'danger',
                        message: 'Minimal penjualan 1 kg',
                      })
                      : setJumlah(jumlah - 1);
                  }}
                  style={{
                    backgroundColor: colors.primary,
                    width: '30%',
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
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>

                  <TextInput keyboardType='number-pad' style={{ fontSize: 18, fontFamily: fonts.secondary[600], color: colors.textPrimary }} onChangeText={x => setJumlah(x)} value={jumlah.toString()} />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    jumlah == show.stok_sales
                      ? showMessage({
                        type: 'danger',
                        message: 'Maksimal qty ' + show.stok_sales,
                      })
                      : setJumlah(jumlah + 1);

                  }}
                  style={{
                    backgroundColor: colors.primary,
                    width: '30%',
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


            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={addToCart}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  padding: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
