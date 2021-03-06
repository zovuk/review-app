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

  componentDidUpdate(prevProps) {
    // ########## Set all markers on the map ##########
    if (
      this.props.restaurants &&
      prevProps.restaurants !== this.props.restaurants
    ) {
      markers.map((e) => e.setMap(null));
      markers = [];
      this.props.restaurants.map((e) => this.addMarker(e));
      markers.map((e) => e.setMap(map));
    }

    // ########## Make marker bounce on hover over restaurant on the list ##########
    if (prevProps.selectedRestaurantID !== this.props.selectedRestaurantID) {
      const id = this.props.selectedRestaurantID
        ? this.props.selectedRestaurantID
        : prevProps.selectedRestaurantID;
      markers
        .find((marker) => marker.id === id)
        .setAnimation(
          this.props.selectedRestaurantID
            ? window.google.maps.Animation.BOUNCE
            : window.google.maps.Animation.NONE
        );
    }

    // ########## Set map center and zoom when toggle Restaurant info ##########
    if (
      prevProps.toggleSearchRestaurants !== this.props.toggleSearchRestaurants
    ) {
      if (!this.props.toggleSearchRestaurants) {
        map.setCenter(
          this.props.restaurants.find(
            (e) => e.place_id === this.props.selectedRestaurantID
          ).geometry.location
        );
        map.setZoom(18);
        markers.map((n) =>
          n.id !== this.props.selectedRestaurantID
            ? n.setMap(null)
            : n.setIcon({
                url: `${options.restaurantIcon.url}!|33338B|FFF`,
                scaledSize: new window.google.maps.Size(45, 45),
                anchor: new window.google.maps.Point(13, 44),
              })
        );
      } else {
        map.setCenter(this.state.savedCenter);
        map.setZoom(this.state.zoom);
      }
    }

    // ########## Get last zoom and center data when new restaurant ##########
    if (
      prevProps.toggleNewPlace !== this.props.toggleNewPlace &&
      !this.props.toggleNewPlace
    ) {
      this.setState({ savedCenter: map.getCenter(), zoom: map.getZoom() });
      this.props.onBoundsChange(map.getBounds());
    }

    if (
      prevProps.toggleNewPlace !== this.props.toggleNewPlace &&
      this.props.toggleNewPlace
    ) {
      markers.map((e) => e.setMap(null));
    }
  }

  addMarker = (e) => {
    if (markers) {
      const marker = new window.google.maps.Marker({
        position: e.geometry.location,
        icon: {
          url: `${options.restaurantIcon.url}${e.label}|33338B|FFF`,
          scaledSize: new window.google.maps.Size(45, 45),
          anchor: new window.google.maps.Point(13, 44),
        },
        title: e.name,
      });
      marker.id = e.place_id;
      markers.push(marker);
    }
  };

  onScriptLoad = () => {
    map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      options.defaultOptions
    );

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
            animation: window.google.maps.Animation.DROP,
            icon: {
              url: options.userIcon.url,
              scaledSize: new window.google.maps.Size(50, 50),
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
      if (this.props.toggleSearchRestaurants && !this.props.toggleNewPlace) {
        this.props.onBoundsChange(map.getBounds());

        // ########## Get center and zoom for returning on the list view ##########
        this.setState({ savedCenter: map.getCenter(), zoom: map.getZoom() });
      }
    });
  };

  render() {
    return (
      <div className="mb-3">
        <div
          className="border border-secondary rounded"
          style={{ width: '100%', paddingBottom: '100%' }}
          id={this.props.id}
        />
      </div>
    );
  }
}

export { map };
export default Map;
