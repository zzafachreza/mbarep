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
import FastImage from 'react-native-fast-image'
import { useCallback } from 'react';
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


  const __renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('BarangList', { key: item.id })} style={styles.itemContainer}>
        <View style={styles.imageWrapper}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={styles.image}
            source={{
              uri: item.image == 'https://mbarep.zavalabs.com/' ? 'https://zavalabs.com/noimage.png' : item.image,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
          />
        </View>
        <Text style={styles.text}>{item.nama_kategori}</Text>
      </TouchableOpacity>
    );
  }, [navigation]);
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white
    }}>
      <FlatList
        numColumns={2}
        data={kategori}
        renderItem={__renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    paddingTop: 5,
    flex: 1,
    backgroundColor: '#97C1E4',
    margin: 5,
    borderRadius: 10,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
  },
  text: {
    textAlign: 'center',
    color: colors.black,
    fontFamily: fonts.secondary[600],
    fontSize: windowWidth / 30,
  }
});
