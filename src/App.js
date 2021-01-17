import React, { Component } from 'react';
import Map from './components/map';
import List from './components/restaurantsList';
// import Marker from './components/markers';
import { options } from './components/options';
import './App.css';
// import { restaurants } from './components/localRestaurants';

let markers = [];
class App extends Component {
  // state = { userPosition: { lat: 45.17, lng: 17.85 } };

  componentDidMount() {
    console.log('componentDidMount');
    // markers.length === 0
    //   ? console.log('markers prazni')
    //   : console.log('ima markera');
    // restaurants.map((e) => console.log(e.location));
    // markers.map((e) => e.setMap(window.myMaps));
    // markers[0].setMap(window.myMaps);
  }

  // Add Marker in markers array //////////////////////////////////////////
  addMarker(position, icon, title) {
    const marker = new window.google.maps.Marker({
      position: position,
      icon: {
        url: icon,
        scaledSize: new window.google.maps.Size(45, 45),
        labelOrigin: new window.google.maps.Point(20, 13),
      },
      // map: window.myMap,
      title: title,
    });
    markers.push(marker);
    console.log('3 - addMarker()');
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <Map
              id="myMap"
              options={{
                center: { lat: 45.17, lng: 17.85 },
                zoom: 15,
              }}
              onMapLoad={(map) => {
                // set map on default position ///////////////////////
                console.log(options.defaultMapCenter);
                map.setCenter(options.defaultMapCenter);

                // Add all MArkers on the Map ///////////////////////////////
                // markers.map((e) => {
                //   e.setMap(map);
                //   console.log('4 - markers.map()');
                // });
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
