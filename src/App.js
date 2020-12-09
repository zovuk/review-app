import React, { Component } from 'react';
import Map from './components/map';
import List from './components/restaurantsList';
// import { markers } from './components/markers';
import './App.css';

class App extends Component {
  state = { userPosition: { lat: 41.0082, lng: 28.9784 } };

  getUserPosition() {
    // getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.setState({
            userPosition: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          });
        },
        () => {
          return alert(
            'Location service is off. Please enable location service!'
          );
        }
      );
    }
  }

  setUserMarker() {
    new window.google.maps.Marker({
      position: this.state.userPosition,
      map: window.myMap,
      title: 'You are here!',
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <Map
              id="myMap"
              options={{
                center: this.getUserPosition(),
                zoom: 15,
              }}
              onMapLoad={(map) => {
                // set map position at user location
                map.setCenter(this.state.userPosition);
                // set user Marker on the map
                this.setUserMarker();
              }}
            />
          </div>
          <div className="col-sm-4">
            <List />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
