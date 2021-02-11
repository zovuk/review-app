import React, { Component } from 'react';
import { map } from './map';

let marker;
class NewRestaurant extends Component {
  state = {
    location: {},
    address: '',
    btnText: 'Add New Restaurant',
  };

  // componentDidMount() {}

  // componentWillUnmount() {
  // }

  componentDidUpdate(prevProps) {
    if (
      prevProps.addingRestaurant !== this.props.addingRestaurant &&
      this.props.addingRestaurant
    ) {
      this.setState({ btnText: 'Submit' });
      window.google.maps.event.addListener(map, 'click', (e) => {
        this.setState({
          location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
        });
        console.log(this.state.location);

        new window.google.maps.Geocoder().geocode(
          { location: this.state.location },
          (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                if (marker) {
                  marker.setMap(null);
                }
                marker = new window.google.maps.Marker({
                  position: this.state.location,
                  // position: this.state.location,
                  title: 'New Restaurant',
                  map,
                });
                marker.setMap(map);
                console.log(results[0].formatted_address);
                this.setState({ address: results[0].formatted_address });
                // console.log(results[0].geometry.location.lat());
                // this.props.addNewOne(
                //   'New Restaurant',
                //   results[0].geometry.location.lat(),
                //   this.state.address
                // );
                // infowindow.open(map, marker);
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          }
        );
      });
    }

    if (
      prevProps.addingRestaurant !== this.props.addingRestaurant &&
      !this.props.addingRestaurant
    ) {
      // this.props.addNewOne(
      //   'New Restaurant',
      //   this.state.location,
      //   this.state.address
      // );
      marker.setMap(null);
      marker = null;
      window.google.maps.event.clearListeners(map, 'click');
      this.setState({ btnText: 'Add New Restaurant' });
    }
  }

  render() {
    return (
      <div>
        <button
          onClick={this.props.handleClick}
          type="button"
          className="btn btn-warning btn-lg btn-block"
        >
          {this.state.btnText}
        </button>
      </div>
    );
  }
}

export default NewRestaurant;
