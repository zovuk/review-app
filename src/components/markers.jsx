import React, { Component } from 'react';

class Markers extends Component {
  // state = {  }
  render() {
    const marker = new window.google.maps.Marker({
      position: { lat: 51.04696585201921, lng: 3.721826640329571 },
      map: window.myMap,
      title: 'Malo Dalje!',
    });
    return marker;
  }
}

export default Markers;
