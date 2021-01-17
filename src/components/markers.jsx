import React, { Component } from 'react';

let userIcon = {
  url: 'http://maps.google.com/mapfiles/kml/paddle/red-stars.png',
  scaledSize: new window.myMap.Size(45, 45),
  labelOrigin: new window.google.maps.Point(20, 13),
};
class Marker extends Component {
  state = {};

  render() {
    return userIcon;
  }
}

export default Marker;
