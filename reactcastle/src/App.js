import React, { Component } from "react";
import "./App.css";
//firebase
import * as firebase from 'firebase';
import config from './firebase.js';

class App extends Component {

  constructor(){
    super()
    this.state = {loading : true}
    firebase.initializeApp(config)
  }
  componentWillMount(){
    const hotelRef = firebase.database().ref('Hotel')

    hotelRef.on('value',snapchot => {
      this.setState({
        hotel: snapchot.val(),
        loading:false
      })
    })
  }
  
  render() {
    if(this.state.loading){
      return(
        <p>Je suis en train de charger.</p>
      )
    }
   const hotel = Object.keys(this.state.hotel).map(key=>{
     return <p key ={key}>{this.state.hotel[key].hotelName}</p>
   })
      return(
        <div>{hotel}</div>
      )
  }
}

export default App;
