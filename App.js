/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Dimensions, Text, View, Button, Image} from 'react-native';
import MapView from 'react-native-maps'
import ImagePicker from 'react-native-image-picker'


export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      choosenLocation:{
        latitude:36.3764402,
        longitude:33.9329887,
        latitudeDelta:0.122,
        longitudeDelta: Dimensions.get('window').width /  Dimensions.get('window').height * 0.122
      },
      locationPicked:false,
      pickedImage:null
    }
  }

  setChoosenlocation = (e) =>{
    console.log(e.nativeEvent)
    const {coordinate} = e.nativeEvent;
    this.map.animateToRegion({  
      ...this.state.choosenLocation,
      latitude:coordinate.latitude,
      longitude:coordinate.longitude,
    })
    this.setState(prevState =>{
      return {
        choosenLocation:{
          ...prevState.choosenLocation,
          latitude:coordinate.latitude,
          longitude:coordinate.longitude,
        },
        locationPicked:true
      }
    })
  }

  getMyLocation = () =>{
    navigator.geolocation.getCurrentPosition(pos=>{
        const coords={
          nativeEvent:{
            coordinate:{
              latitude:pos.coords.latitude,
              longitude:pos.coords.longitude
            }
          }
        };
        this.setChoosenlocation(coords);
      }, err=>{ console.log(err)});
  }
  
  selectImage = () =>{
    ImagePicker.showImagePicker({title:"Resim Ekle"}, res =>{
      if(res.didCancel)
      {
        //kullanici resim secmeden islemi iptal ederse..
      }
      else if(res.error)
      {
        // islem sirasinda hata olusursa..
      }
      else
      {
        this.setState({pickedImage: {uri:res.uri}})
      }
    })
  }
  render() {
    let marker = null;
    if(this.state.locationPicked){
      marker = <MapView.Marker coordinate={this.state.choosenLocation} />
    }
    return (
      <View>
          <MapView 
          initialRegion = {this.state.Ankara} 
          style={{width:'100%', height:250}}
           onPress={((e) => this.setChoosenlocation(e))} 
           ref = {ref => this.map = ref}
           >
           {marker}
           </MapView>
           <Button title="Buradayim" onPress={()=>this.getMyLocation()} ></Button>
           <Button title="Resim Ekle" onPress={this.selectImage} ></Button>
           <View style={{flex:1}}>
             <Image source={this.state.pickedImage} style={{width:'100%', height:200}}/>
           </View>
      </View>
    );
  }
}
