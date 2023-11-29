import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { colors } from '../../utils/colors';
import { windowWidth, fonts } from '../../utils/fonts';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import { MyPicker } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
export default function ({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDataBarang();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {






    getDataBarang();

  }, []);

  const getDataBarang = () => {
    getData('user').then(res => {
      axios
        .post(urlAPI + '/transaksi.php', {
          fid_user: res.id,
        })
        .then(x => {
          console.log(x.data);
          setData(x.data);
        });
    });
  };


  const [tanggal, setTanggal] = useState({
    awal: moment().format('YYYY-MM-DD'),
    akhir: moment().format('YYYY-MM-DD'),
    status: 'SEMUA'
  })

  // const renderItem = ({ item }) => (


  // );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
      style={{
        padding: 10,
        backgroundColor: colors.background1,
      }}>

      <View style={{
        flexDirection: 'row',
        marginBottom: 10,
      }}>
        <View style={{
          flex: 1,
          padding: 2,
        }}>
          <DatePicker
            style={{ width: '100%' }}
            date={tanggal.awal}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginTop: 10,
                borderColor: colors.primary,
                borderRadius: 10,
                height: 50,
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={date => setTanggal({
              ...tanggal,
              awal: date
            })}
          />
        </View>

        <View style={{
          flex: 1,
          padding: 2,
        }}>
          <DatePicker
            style={{ width: '100%' }}
            date={tanggal.akhir}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginTop: 10,
                borderColor: colors.primary,
                borderRadius: 10,
                height: 50,
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={date => setTanggal({
              ...tanggal,
              akhir: date
            })}
          />
        </View>
        <View style={{
          flex: 1,
          padding: 2,
        }}>
          <MyPicker onValueChange={x => setTanggal({
            ...tanggal,
            status: x
          })} value={tanggal.status} data={[
            { label: 'SEMUA', value: 'SEMUA' },
            { label: 'LUNAS', value: 'LUNAS' },
            { label: 'BELUM LUNAS', value: 'BELUM LUNAS' },
            { label: 'BATAL', value: 'BATAL' },

          ]} nolabel={true} />
        </View>
        <View style={{
          padding: 2,
        }}>
          <TouchableOpacity onPress={() => {
            console.log(tanggal);
            getData('user').then(res => {
              axios
                .post(urlAPI + '/transaksi.php', {
                  fid_user: res.id,
                  awal: tanggal.awal,
                  akhir: tanggal.akhir,
                  status: tanggal.status
                })
                .then(x => {
                  console.log(x.data);
                  setData(x.data);
                });
            });
          }} style={{
            flex: 1,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            borderRadius: 5,
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
            <Icon type='ionicon' name='search' color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput onChangeText={x => {

        const filtered = data.filter(i => i.nama_customer.toLowerCase().indexOf(x.toLowerCase()) > -1)


        setData(filtered);
        if (x.length == 0) {
          getDataBarang();
        } else {
          setData(filtered);
        }
      }} placeholder='Cari Customer' style={{
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.primary,
        paddingLeft: 10,
        fontSize: windowWidth / 30,
        color: colors.black,
        fontFamily: fonts.secondary[600],
      }} />

      <FlatList data={data} renderItem={({ item, index }) => {
        let tgl = '';
        let mytotal = 0;
        let jumlahTrx = 0;
        if (index == 0) {
          tgl = data[index].tanggal;
          let tmp = data.filter(i => i.tanggal.toLowerCase().indexOf(data[index].tanggal.toLowerCase()) > -1);
          tmp.map(i => {
            if (i.status == 'LUNAS') {
              mytotal += parseFloat(i.harga_total)
            }

          })
          jumlahTrx = tmp.length
        } else if (data[index - 1].tanggal !== data[index].tanggal) {
          tgl = data[index].tanggal;
          let tmp = data.filter(i => i.tanggal.toLowerCase().indexOf(data[index].tanggal.toLowerCase()) > -1);
          tmp.map(i => {
            if (i.status == 'LUNAS') {
              mytotal += parseFloat(i.harga_total)
            }
          });
          jumlahTrx = tmp.length;

        } else {
          tgl = '';
        }

        return (
          <>
            {tgl !== '' && (
              <View style={{
                marginTop: 5,
                paddingVertical: 2,
                paddingHorizontal: 5,
                flexDirection: 'row',
                backgroundColor: colors.border
              }}>
                <Text style={{
                  flex: 1,
                  fontSize: windowWidth / 30,
                  fontFamily: fonts.secondary[600],
                  color: colors.white,
                }}>{tgl}</Text>
                <Text style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: windowWidth / 30,
                  fontFamily: fonts.secondary[600],
                  color: colors.white,
                }}>{new Intl.NumberFormat().format(mytotal)}</Text>
                <Text style={{
                  flex: 1,
                  textAlign: 'right',
                  fontSize: windowWidth / 30,
                  fontFamily: fonts.secondary[600],
                  color: colors.white,
                }}>{new Intl.NumberFormat().format(jumlahTrx)}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate('ListDetail', item)}
              style={{
                paddingHorizontal: 10,
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
                    fontSize: windowWidth / 30,
                    color: colors.black,
                    fontFamily: fonts.secondary[600],
                  }}>
                  {item.kode}
                </Text>
                <Text
                  style={{
                    fontSize: windowWidth / 30,
                    color: colors.primary,
                    fontFamily: fonts.secondary[600],
                  }}>
                  {item.nama_customer}
                </Text>
                {/* <Text
                  style={{
                    fontSize: windowWidth / 30,
                    color: colors.black,
                    fontFamily: fonts.secondary[400],
                  }}>
                  {item.tanggal}
                </Text> */}
                <Text style={{
                  fontSize: windowWidth / 35,
                  fontFamily: fonts.secondary[200],
                  color: colors.textPrimary,

                }}>{item.catatan}</Text>


              </View>
              <View style={{
                flex: 1,
              }}>
                <Text style={{
                  textAlign: 'center',
                  fontSize: windowWidth / 35,
                  fontFamily: fonts.secondary[400],
                  color: colors.textPrimary,

                }}>{item.jam}</Text>
              </View>
              <View style={{
                flex: 1,
                alignItems: 'flex-end'
              }}>
                <Text style={{
                  fontSize: windowWidth / 25,
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}> Rp. {new Intl.NumberFormat().format(item.harga_total)}</Text>

                <Text
                  style={{
                    fontSize: windowWidth / 40,
                    color: item.status == 'LUNAS' ? colors.success : item.status == 'BATAL' ? colors.border : colors.danger,
                    fontFamily: fonts.secondary[600],
                  }}>
                  {item.status}
                </Text>


              </View>
            </TouchableOpacity>
          </>

        )
      }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
