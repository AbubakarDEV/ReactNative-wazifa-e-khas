import React,{useState} from 'react';
import { StyleSheet, Text, View ,Image,ScrollView,Button,Modal,Dimensions,Linking} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants'
import categories from './Screens/categories'
import SingleCategory from './Screens/SingleCategory'
import ShareExample from './Screens/ShareExample'
import about from './Screens/about'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
console.disableYellowBox = true;
global.selected = []
const Stack = createStackNavigator();
const option={
  title:"", //for login
  headerTintColor:'#da5233',
  headerStyle:{
    backgroundColor:'#292561',

  }
}
export default function App() {
  let phoneNumber = "+92 336 8369647"
  const [modal,setModal]  = useState("") 
  return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName={"cat"} >
        {/* <Stack.Screen name="cat" component={categories} options={{...option,title:"Wazifa-e-Khas",headerLeft: null,headerShown:true}} /> */}
        <Stack.Screen name="cat" component={categories} options={{
          headerTitle: "Wazifa-e-Khas" ,
          headerTintColor:'#da5233',
          headerStyle:{
          backgroundColor:'#292561',
        },
          headerRight: () => (
            <Button
              onPress={() => setModal(true)}
              title="Contact-us"
              color="#da5233"
            />
          ),
        }} />
        <Stack.Screen name="Scat" component={SingleCategory} options={{...option,title:global.selected,headerShown:true}} />
        <Stack.Screen name="se" component={ShareExample} options={{...option,title:global.selected,headerShown:true}} />
        <Stack.Screen name="ab" component={about} options={{...option,title:"About-us",headerShown:true}} />
      </Stack.Navigator>
      <Modal
                animationType="fade"
                transparent={true}
                visible = {modal}
                >
                <View style={styles.modalView}>
                <View style={{margin:5}}>
                <Text style={{color:'black', textAlign:'center',position:'absolute',top:0,right:5,width:30,zIndex:1, fontSize:30,alignSelf:'flex-end',margin:5}} onPress={()=>{setModal(false)}}>&#10005;</Text>
                
                <Image
                style={{width:'100%',height:windowHeight/3,resizeMode:'stretch',borderRadius:10 }}
                source={require('./assets/logo.jpg')}
                />
                <Text></Text>
                <Text style={{marginLeft:10,fontSize:18,color:'#da5233'}}>
                We are software company located in Pakistan , and we aim to provide best services to our customers in.{"\n"}
                1. Web Development{"\n"}
                2. Mobile App Development{"\n"}
                3. Web Design{"\n"}
                4. UI/UX Design{"\n"}
                5. Shopify{"\n"}
                {"\n"}
                </Text>
                <Text style={{marginLeft:10,fontSize:20,color:'white',textShadowColor:'#da5233'}}>
                Contact us{"\n"}
                Website:{"\n"}
                www.socketit.com{"\n"}
                Email:{"\n"}
                info@socketit.com{"\n"}
                051-8899647{"\n"}
                <Text onPress={()=>{Linking.openURL(`tel:${phoneNumber}`)}}>+92 336 8369647</Text>
                </Text>
                <View style={{position:'absolute',top:windowHeight/1.15,width:windowWidth/2.5,alignSelf:'flex-end'}}>
                <Button color="#da5233" title="Close" onPress={()=>setModal(false)}></Button>
                </View>
                <View style={{position:'absolute',top:windowHeight/1.15,width:windowWidth/2.5,alignSelf:'flex-start'}}>
                <Button color="#da5233" title="View on Playstore" onPress={()=>Linking.openURL("https://play.google.com/store/apps/dev?id=8066322027616403908")}></Button>
                </View>
                </View>
                </View>
        </Modal>
      </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop:Constants.statusBarHeight
  },
  modalView:{
    height:windowHeight,
    width:windowWidth,
    alignSelf:'center',
    backgroundColor:'#292561',
}
});
