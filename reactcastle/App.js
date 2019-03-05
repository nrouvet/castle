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
      return <p>loading</p>;
    }

    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
            integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href="style.css" />
          <title>Casle</title>
        </head>
        <body>
          <img
            src="https://upload.wikimedia.org/wikipedia/fr/thumb/b/be/Logo_Relais_et_Chateaux.png/280px-Logo_Relais_et_Chateaux.png"
            class="imgPriv"
            alt="castle" 
          />
          <h1>Liste des Hotels Restaurants étoilés</h1>
          <center>
            <div>
              <p>
                <div className="wrapper">
                  <ul>
                    {this.state.hotel.map(hotel => {
                      return (
                        <section class="full-width">
                          
                            <li key={hotel.hotelName}>
                              
                              <p>chef: {hotel.chef}</p>
                              <p> {hotel.url}</p>
                            </li>
                          
                        </section>
                      );
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
