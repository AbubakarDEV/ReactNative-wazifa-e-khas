import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View ,Image,ScrollView, KeyboardAvoidingView,Modal} from 'react-native';
import Constants from 'expo-constants';
import { TextInput , Button, Badge,FAB} from 'react-native-paper';
import baseUrl from './baseUrl';
import { FlatList } from 'react-native';
import { TouchableOpacity ,Share,ShareOptions,StatusBar} from 'react-native';
import { Keyboard } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
  } from 'expo-ads-admob';
const theme = {
    colors:{
        primary : "green"
    }
}
const theme1  = {
  colors:{
      primary : "white"
  }
}
const SingleCategory = (props)=>{
    const [modal,setModal]  = useState("") 
    const [img,setImg] = useState("")
    const [sCat,setScat] = useState("")
    const singleCate=async()=>{
        console.log(global.cat)
        const result = await fetch(`${baseUrl}api/category/${global.cat}/detail`)
        const resp = await result.json()
        if(resp.data)
        setScat(resp.data)
        // alert(JSON.stringify(resp))
        // console.log(resp.data)
    }
    const addShare=async()=>{
        const result = await fetch(`${baseUrl}api/category/${global.cat}/share?DeviceId=${global.deviceId}`,{method: 'PUT'})
        const resp = await result.json()
        // alert(JSON.stringify(resp))
        // console.log(resp)
    }
    useEffect(()=>{singleCate()},[])
    const share = async ()=>{ 
      FileSystem.downloadAsync(
      img,
      FileSystem.documentDirectory  + '.jpeg'
    )
      .then(({ uri }) => { 
          addShare()
          console.log('Finished downloading to ', uri);
          Sharing.shareAsync(uri); 
      })
      .catch(error => {
        console.error(error); 
      });
    }
    return (
        <View style={modal?styles.container2:styles.container}>     
        <View style={{width:windowWidth,height:70,borderWidth:2,borderColor:'#292561',backgroundColor:'white',zIndex:1}}>
        <AdMobBanner
                    bannerSize="smartBannerLandscape"
                    adUnitID="ca-app-pub-3666457396600268/6507736863" // Test ID, Replace with your-admob-unit-id
                    // adUnitID="ca-app-pub-3940256099942544/6300978111"
                    servePersonalizedAds// true or false
                    onDidFailToReceiveAdWithError={console.log("Error in ads")} />
        </View>
        {sCat==""&&
            // <Text style={{fontSize:20,alignSelf:'center',marginTop:50,color:'gray'}}>No data found</Text>
            <Image
                 style={{width:150,height:150,alignSelf:'center'}}
                 source={require('../assets/a.gif')}/>
        }
 
         <FlatList
                 keyExtractor={item=>item.id}
                //  data = {CategoryDetail.filter(CategoryDetail=>CategoryDetail.un == global.cat)}
                data = {sCat}
                 numColumns={2}
                 renderItem={({item})=>
                    <TouchableOpacity style={styles.cat} onPressIn={()=>setImg(item.url)} onPress={()=>setModal(true)}>
                        {/* <Text style={styles.catText}>{item.Path}</Text> */}
                    <Image style={{height:'100%',width:'100%',alignSelf:'center'}} key={item.id} source={{uri:item.url}}></Image>
                    </TouchableOpacity>    
                }
            >
        </FlatList>


            {/* <View style={{flex:1,flexDirection:'row'}}>
                <TouchableOpacity onPress={() => setModal(true)} style={{flex:0.5,borderWidth:1,borderColor:'orange'}}>
                    <Image source={require('../assets/splash.png')} style={{height:200,width:'100%'}}/>
                </TouchableOpacity>
                <View style={{flex:0.5,borderWidth:1,borderColor:'orange'}}>
                    <Image source={require('../assets/background.png')} style={{height:200,width:'100%'}}/>
                </View>
            </View> */}
        <Modal
                animationType="fade"
                transparent={true}
                visible = {modal}
                >
                <View style={styles.modalView}>
                <View style={{margin:5}}>
                <Text style={{color:'white', textAlign:'center',position:'absolute',top:0,right:5,width:30,zIndex:1, fontSize:30,alignSelf:'flex-end',margin:5}} onPress={()=>{setModal(false)}}>&#10005;</Text>
                <Image source={{uri:img}} style={{height:windowHeight/1.85,width:'100%',alignSelf:'center',borderWidth:2,borderRadius:10,borderColor:'white',}}/>
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
    container2: {
      flex: 1,
      // marginTop:Constants.statusBarHeight,
      backgroundColor: '#fff',
      opacity:0.6
      },
    cat:{
        alignSelf:'center',
        height:200,
        width:windowWidth/2.06,
        borderColor:'#da5233',
        borderWidth:1,
        color:'#da5233',
        margin:3,
    },
    catText:{
        alignSelf:'center',
        lineHeight:50,
        fontSize:20,
        color:'#da5233',
    },
    modalView:{
        height:windowHeight/2,
        width:windowWidth/1.03,
        marginTop:windowHeight/4,alignSelf:'center',
    }
})
export default SingleCategory