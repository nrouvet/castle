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
    const hotelRef = firebase.database().ref("hotel");

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
          <div class="container">
            
              <img
                src="https://upload.wikimedia.org/wikipedia/fr/thumb/b/be/Logo_Relais_et_Chateaux.png/280px-Logo_Relais_et_Chateaux.png"
                class="imgPriv"
                alt="castle"
              />
              <h1>Liste des Hotels Restaurants étoilés</h1>
            
          </div>
          <center>
            <div>
              <p>
                <div className="wrapper">
                  <ul>
                    {this.state.hotel.map(hotel => {
                      //console.log(hotel);
                      return (
                        <section class="full-width">
                          <table
                            id="selectedColumn"
                            class="table table-striped table-bordered table-sm"
                            cellspacing="0"
                            width="100%"
                          >
                            <thead>
                              <tr>
                                <th class="th-sm">Name</th>
                                <th class="th-sm">Chief</th>
                                <th class="th-sm">Restaurant</th>
                                <th class="th-sm">Price</th>
                                <th class="th-sm">Url</th>
                              
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{hotel.hotelName}</td>
                                <td>{hotel.chef}</td>
                                <td>{hotel.restaurantName}</td>
                                <td>{hotel.price}</td>
                                <td>{hotel.url}</td>
                              </tr>
                            </tbody>
                            <tfoot>
                            </tfoot>
                          </table>
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
