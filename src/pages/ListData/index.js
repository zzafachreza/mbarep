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

import 'intl';
import 'intl/locale-data/jsonp/en';
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ListDetail', item)}
      style={{
        padding: 10,
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
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.black,
            fontFamily: fonts.secondary[400],
          }}>
          {item.tanggal}
        </Text>
        <Text style={{
          fontSize: windowWidth / 35,
          fontFamily: fonts.secondary[200],
          color: colors.textPrimary,

        }}>{item.catatan}</Text>


      </View>
      <View>
        <Text style={{
          fontSize: windowWidth / 25,
          fontFamily: fonts.secondary[600],
          color: colors.black,
        }}> Rp. {new Intl.NumberFormat().format(item.harga_total)}</Text>

      </View>
    </TouchableOpacity>
  );

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
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
