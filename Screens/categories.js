import React, {useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View ,Image,ScrollView, Modal} from 'react-native';
import Constants from 'expo-constants';
import { TextInput , Button, Badge} from 'react-native-paper';
import baseUrl from './baseUrl';
import { FlatList } from 'react-native';
import * as Permissions from 'expo-permissions';
import { TouchableOpacity } from 'react-native';
import { Keyboard } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
global.deviceId = Expo.Constants.deviceId;
// import { Notifications } from 'expo';
import * as Notifications from 'expo-notifications';
global.tkn = ""
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
  } from 'expo-ads-admob';

global.cat = ""
const theme = {
    colors:{
        primary : "#292561"
    }
}
const theme1  = {
    colors:{
        primary : "white"
    }
  }
const images = []
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
const categories = (props)=>{
    const [modal,setModal]  = useState("") 
    const [img,setImg] = useState("")
    const [cat,setCat] = useState("")
    const [mShare,setMshare] = useState("")

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const sendTokenAndDeviceID=async(tkn)=>{
      const result1 = await fetch(`${baseUrl}api/setting/token?DeviceId=${global.deviceId}&Token=${tkn}`,{method: 'POST'})
      // console.log(`${baseUrl}api/setting/token?DeviceId=${global.deviceId}&Token=${tkn}`)
      const resp1 = await result1.json()
      // console.log(resp1)
    }
    async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
          sendTokenAndDeviceID(token)
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
        // alert(token)
        return token;
      }
    
    const getCat=async()=>{
        const result1 = await fetch(`${baseUrl}api/category/5/mostshare`)
        const resp1 = await result1.json()
        if(resp1.success){
            setMshare(resp1.data)
            // alert(JSON.stringify(resp1.data[0].url))
            for(let i=0;i<resp1.data.length;i++)
                images.push(resp1.data[i].url)
            // console.log(images)
        }
        const result = await fetch(`${baseUrl}api/category`)
        const resp = await result.json()
        if(resp.success){
            setCat(resp.data)
        }
    }
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }, []);
    useEffect(()=>{getCat()},[])
    function _SetImgModal(a)
    {
        setImg(a)
        setModal(true)
    }
    const share = async ()=>{ 
        FileSystem.downloadAsync(
        img,
        FileSystem.documentDirectory  + '.jpeg'
      )
        .then(({ uri }) => { 
            console.log('Finished downloading to ', uri);
  
            Sharing.shareAsync(uri); 
        })
        .catch(error => {
          console.error(error); 
        });
      }
    return (
        <View style={styles.container}>
        {/* <Button style={{position:'absolute',top:-10,right:0,backgroundColor:'red'}} mode="text">About-us</Button> */}
        <View style={modal?{opacity:0.6}:{opacity:1}}>
        <Text style={{color:"#da5233",}}>    Top Trending</Text>
        <SliderBox images={images}
        autoplay
        circleLoop
        sliderBoxHeight={200}
        dotColor="#da5233"
        dotStyle={{marginBottom:10}}
        inactiveDotColor="#90A4AE"
        ImageComponentStyle={{borderRadius: 5, width: '97%', marginTop: 5,resizeMode: 'stretch',}}
        imageLoadingColor="#da5233"
        onCurrentImagePressed={index =>
            // alert(images[index])
            _SetImgModal(images[index])
          }
        />

        {/* <Button icon="share-variant" style={{position:'absolute',top:windowHeight/3.7,right:0}} theme={theme1}>Share</Button> */}
                {cat==""&&
                // <Text style={{fontSize:20,alignSelf:'center',marginTop:20,color:'gray'}}>Loading.... </Text>
                <Image
                 style={{width:150,height:150,alignSelf:'center'}}
                 source={require('../assets/a.gif')}/>
                }
                <FlatList
                    style={{height:windowHeight/2.28,marginTop:3 }}
                    keyExtractor={item=>item.id}
                    // data = {Categories}
                    data = {cat}
                    renderItem={({item})=>
                        <TouchableOpacity style={styles.cat} onPressIn={()=>global.cat=item.id}  onPress={()=>props.navigation.navigate("Scat")} onPressOut={()=>{global.selected[0]=item.name}} ><Text style={styles.catText}>{item.name}</Text></TouchableOpacity>    
                    }
                >
                </FlatList>
        </View>
            <View style={{position:'absolute',bottom:0,width:windowWidth,height:70,borderWidth:2,borderColor:'#292561',backgroundColor:'white',marginBottom:0}}>
                <AdMobBanner
                    bannerSize="smartBannerLandscape"
                    adUnitID="ca-app-pub-3666457396600268/6507736863" // Test ID, Replace with your-admob-unit-id
                    // adUnitID="ca-app-pub-3940256099942544/6300978111"
                    servePersonalizedAds// true or false
                    onDidFailToReceiveAdWithError={console.log("Error in ads")} />
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible = {modal}
                >
                <View style={styles.modalView}>
                <View style={{margin:5}}>
                <Text style={{color:'white', textAlign:'center',position:'absolute',top:0,right:5,width:30,zIndex:1, fontSize:30,alignSelf:'flex-end',margin:5}} onPress={()=>{setModal(false)}}>&#10005;</Text>
                <Image source={{uri:img}} style={{height:windowHeight/1.85,width:'100%',alignSelf:'center',borderWidth:2,borderRadius:10,borderColor:'white'}}/>
                <Button style={{position:'absolute',bottom:2,right:0}} icon="share-variant"theme={theme1}  onPress={share}>Share</Button>
                </View>
                </View>
        </Modal>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    // marginTop:Constants.statusBarHeight,
    backgroundColor: '#fff',
    },
    cat:{
        alignSelf:'center',
        height:50,
        width:'97%',
        backgroundColor:'#292561',
        margin:1,
        borderWidth:1,
        borderRadius:5
    },
    catText:{
        alignSelf:'center',
        lineHeight:50,
        fontSize:20,
        // letterSpacing:15,
        // color:'#da5233',
        color:'white',
        
    },
    modalView:{
        height:windowHeight/2,
        width:windowWidth/1.03,
        marginTop:windowHeight/4,alignSelf:'center',
    }
})
export default categories