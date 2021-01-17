import React, { Component } from 'react';
import { theKey } from './apiKey';
// import { render } from 'react-dom';
class Map extends Component {
  constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this);
  }

  onScriptLoad() {
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options
    );
    this.props.onMapLoad(map);
    // window.myMaps = map;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          console.log('map.setCenter - component map.jsx');
          new window.google.maps.Marker({
            position: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
            map,
            icon: {
              url: 'http://maps.google.com/mapfiles/kml/paddle/red-stars.png',
              scaledSize: new window.google.maps.Size(45, 45),
              labelOrigin: new window.google.maps.Point(20, 13),
            },
            title: 'You are here!',
          });
          console.log('user marker');
        },
        () => {
          return alert(
            'Location service is off. Please enable location service!'
          );
        }
      );
    }
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=${theKey}`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', (e) => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }

  render() {
    return (
      <div
        className="card border-dark m-2"
        style={{ width: '100%', height: '98vh' }}
        id={this.props.id}
      />
    );
  }
}

export default Map;
