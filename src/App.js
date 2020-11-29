import React, { Component } from 'react';
import Map from './components/map';
import './App.css';

class App extends Component {
  // state = {  }

  render() {
    return (
      <React.Fragment>
        <div>Hello World</div>
        <Map
          id="myMap"
          options={{
            center: { lat: 41.0082, lng: 28.9784 },
            zoom: 15,
          }}
          onMapLoad={(map) => {
            // getting user location
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const userPosition = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  };

                  // setting map position at user location
                  map.setCenter(userPosition);

                  // set user MArker on the map
                  const marker = new window.google.maps.Marker({
                    position: userPosition,
                    map: map,
                    title: 'You are here!',
                  });
                },
                () =>
                  alert(
                    'Location service is off. Please enable location service!'
                  )
              );
            }
          }}
        />
      </React.Fragment>
    );
  }
}

export default App;
