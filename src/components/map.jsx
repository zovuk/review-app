import React, { Component } from 'react';
import { theKey } from './apiKey';
import { options } from './options';

let map;
let markers = [];
class Map extends Component {
  componentDidMount() {
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=${theKey}&libraries=places`;
      s.async = true;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important.
      // We cannot access google.maps until it's finished loading
      s.addEventListener('load', (e) => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }

  componentDidUpdate(a, b) {
    if (a.restaurants !== this.props.restaurants) {
      markers.map((e) => e.setMap(null));
      markers = [];
      this.props.restaurants.map((e) =>
        this.addMarker(e.geometry.location, e.name)
      );
      console.log(markers);
      markers.map((e) => e.setMap(map));
    }
  }

  addMarker = (location, name) => {
    const marker = new window.google.maps.Marker({
      position: location,
      icon: {
        url: options.restaurantIcon.url,
        scaledSize: new window.google.maps.Size(45, 45),
        labelOrigin: new window.google.maps.Point(20, 13),
      },
      title: name,
    });
    markers.push(marker);
  };

  onScriptLoad = () => {
    map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options
    );
    this.props.onMapLoad(map);
    window.myMaps = map;

    // ########## Get user location ##########
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          new window.google.maps.Marker({
            position: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
            map,
            icon: {
              url: options.userIcon.url,
              scaledSize: new window.google.maps.Size(45, 45),
              labelOrigin: new window.google.maps.Point(20, 13),
            },
            title: 'You are here!',
          });
        },
        () => {
          return alert(
            'Location service is off. Please enable location service!'
          );
        }
      );
    }

    // ########## Get bounds with idle listener ##########
    window.google.maps.event.addListener(map, 'idle', () => {
      const neBounds = map.getBounds().getNorthEast();
      const swBounds = map.getBounds().getSouthWest();
      const sw = { lat: swBounds.lat(), lng: swBounds.lng() };
      const ne = { lat: neBounds.lat(), lng: neBounds.lng() };
      this.props.onBoundsChange({ sw, ne });

      // ########## Get restaurants from google places Nearby search ##########
      const service = new window.google.maps.places.PlacesService(
        window.myMaps
      );
      service.nearbySearch(
        {
          bounds: window.myMaps.getBounds(),
          type: ['restaurant'],
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            this.props.onFetch(results);
          }
        }
      );
    });
  };

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
