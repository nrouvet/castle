import React, { Component } from "react";
import "./App.css";
//firebase
import * as firebase from "firebase";
import config from "./firebase.js";

class App extends Component {
  constructor() {
    super();
    this.state = { loading: true };
    firebase.initializeApp(config);
  }
  componentWillMount() {
    const hotelRef = firebase.database().ref("Hotel");

    hotelRef.on("value", snapchot => {
      this.setState({
        hotel: snapchot.val(),
        loading: false
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <p>Je suis en train de charger.</p>;
    }
    

    return (
      <html>
        <head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
    crossorigin="anonymous" />
  <link rel="stylesheet" href="style.css" />
  <title>Casle</title>
        </head>
        <body>
  <center>
    <div class="container rounded" >
      <p>
        <h1>Liste des Hotels Restaurants étoilés</h1>
      </p>
      <p>
        <div className ='wrapper'>
        <ul>
          {this.state.hotel.map((hotel) =>{
            return(
              <li key = {hotel.id}>
              <h3>{hotel.hotelName}</h3>
              <p>chef: {hotel.chef}</p>
              <p>url : {hotel.url}</p>
              </li>
            )
          })}
          </ul>
        </div>
      </p>
    </div>
    </center>
</body>
 
      </html>
    );
  }
}

export default App;
