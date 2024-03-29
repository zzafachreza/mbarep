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
  Linking,
  StyleSheet
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowWidth } from '../../utils/fonts';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [kategori, setKategori] = useState([]);

  const [produk, setProduk] = useState([]);
  const [cart, setCart] = useState(0);
  const [token, setToken] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);

      // console.log(obj);

      // alert(obj.notification.title)



      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'mbarepgroup', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });


    getDataKategori();

    if (isFocused) {
      __getDataUserInfo();
    }
    return unsubscribe;
  }, [isFocused]);




  const getDataKategori = () => {
    axios.post(urlAPI + '/1data_kategori.php').then(res => {

      setKategori(res.data);
    })
  }



  const __getDataUserInfo = () => {
    getData('user').then(users => {
      console.log(users);
      setUser(users);
      axios.post(urlAPI + '/1_cart.php', {
        fid_user: users.id
      }).then(res => {
        console.log('cart', res.data);

        setCart(parseFloat(res.data))
      })
      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
        axios
          .post(urlAPI + '/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });
    });
  }

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;

  const __renderItemKategori = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Barang', {
        key: item.id,
        id_user: user.id
      })} style={{
        backgroundColor: colors.secondary,
        marginHorizontal: 5,
        borderRadius: 5,
        overflow: 'hidden',
        flex: 0.5,
        marginVertical: 5,

      }}>

        <View style={{
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <Image style={{
            width: '100%',
            height: 100,

          }} source={{
            uri: item.image
          }} />
        </View>
        <Text style={{
          textAlign: 'center',
          padding: 10,
          color: colors.white,
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 30,
        }}>{item.nama_kategori}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>

      <View
        style={{
          height: windowHeight / 10,
          padding: 10,
          backgroundColor: colors.background1,
        }}>


        <View style={{
          flexDirection: 'row'
        }}>
          <TouchableOpacity onPress={() => navigation.navigate('Barang', {
            key: 0,
            id_user: user.id
          })} style={{
            flex: 1,
            height: 40,
            flexDirection: 'row',
            backgroundColor: colors.background6,
            borderRadius: 5,

          }}>

            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
              <Icon type='ionicon' name="search-outline" color={colors.border} size={windowWidth / 30} />
            </View>
            <View style={{
              paddingLeft: 5,
              flex: 1,
              justifyContent: 'center'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                color: colors.border,
                fontSize: windowWidth / 30
              }}>Search Product</Text>
            </View>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://wa.me/62818881222')
            }}
            style={{
              position: 'relative',
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'


            }}>
            <Icon type='ionicon' name="logo-whatsapp" color={colors.border} />

          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{
              position: 'relative',
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'


            }}>
            <Icon type='ionicon' name="cart-outline" color={colors.border} />
            <Text style={{
              position: 'absolute', top: 2, right: 2, bottom: 5, backgroundColor: colors.primary, width: 18,
              textAlign: 'center',
              height: 18, borderRadius: 10, color: colors.white
            }} >{cart}</Text>

          </TouchableOpacity>
        </View>


      </View>

      <MyCarouser />


      <View style={{
        justifyContent: 'center',
        flex: 1,
      }}>
        <View style={{
          flexDirection: 'row',
          marginVertical: 10,
          marginHorizontal: 10,
        }}>
          <TouchableOpacity onPress={() => navigation.navigate('Barang', {
            key: 0
          })} style={styles.mbtn}>
            <Image source={require('../../assets/a1.png')} style={styles.mimg} />
            <Text style={styles.mtext}>Transaksi Baru</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ListData')} style={styles.mbtn}>
            <Image source={require('../../assets/a2.png')} style={styles.mimg} />
            <Text style={styles.mtext}>Transaksi</Text>
          </TouchableOpacity>
        </View>
        <View style={{
          flexDirection: 'row',
          marginHorizontal: 10,
          marginVertical: 10,
        }}>
          <TouchableOpacity style={styles.mbtn} onPress={() => navigation.navigate('Kategori')}>
            <Image source={require('../../assets/a3.png')} style={styles.mimg} />
            <Text style={styles.mtext}>Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Customer')} style={styles.mbtn}>
            <Image source={require('../../assets/a4.png')} style={styles.mimg} />
            <Text style={styles.mtext}>Pelanggan</Text>
          </TouchableOpacity>
        </View>
      </View>


    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  mbtn: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
  },
  mimg: {
    width: 70,
    height: 70,
    margin: 10,
    resizeMode: 'contain'
  },
  mtext: {
    marginTop: 10,
    fontSize: windowWidth / 30,
    color: colors.white,
    fontFamily: fonts.secondary[600]
  }
})