import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowWidth } from '../../utils/fonts';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';

export default function Kategori({ navigation }) {
  const [kategori, setKategori] = useState([]);


  const getDataKategori = () => {
    axios.post(urlAPI + '/1data_kategori.php').then(res => {
      console.log('kategori', res.data);

      setKategori(res.data);
    })
  }

  useEffect(() => {
    getDataKategori();
  }, [])


  const __renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('BarangList', {
        key: item.id
      })} style={{
        padding: 10,
        paddingTop: 5,
        flex: 1,
        backgroundColor: '#97C1E4',
        margin: 5,
        borderRadius: 10,

      }}>

        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Image style={{
            width: '100%',
            height: 150,
            resizeMode: 'contain'

          }} source={{
            uri: item.image
          }} />
        </View>
        <Text style={{
          textAlign: 'center',
          color: colors.black,
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 30,
        }}>{item.nama_kategori}</Text>
      </TouchableOpacity>
    )
  }
  return (
    <View style={{
      flex: 1
    }}>
      <FlatList numColumns={2} data={kategori} renderItem={__renderItem} />
    </View>
  )
}

const styles = StyleSheet.create({})