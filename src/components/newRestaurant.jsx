import React, { Component } from 'react';
import { map } from './map';

let marker;
class NewRestaurant extends Component {
  state = {
    name: 'Name of the Restaurant?',
    btnText: 'Add New Restaurant',
  };

  // componentDidMount() {}

  // componentWillUnmount() {
  // }

  componentDidUpdate(prevProps) {
    if (
      prevProps.toggleNewPlace !== this.props.toggleNewPlace &&
      this.props.toggleNewPlace
    ) {
      this.setState({ btnText: 'Submit' });
      window.google.maps.event.addListener(map, 'click', (e) => {
        this.props.addNewPlace({
          geometry: {
            location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
          },
        });

        new window.google.maps.Geocoder().geocode(
          { location: this.props.newPlace.geometry.location },
          (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                // If marker existed remove it
                if (marker) {
                  marker.setMap(null);
                }

                // Add new Marker
                marker = new window.google.maps.Marker({
                  position: this.props.newPlace.geometry.location,
                  title: 'New Restaurant',
                  map,
                });

                // Address + ID of new Place
                this.props.addNewPlace({
                  vicinity: results[0].formatted_address,
                });
                this.props.addNewPlace({ place_id: results[0].place_id });
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
      prevProps.toggleNewPlace !== this.props.toggleNewPlace &&
      !this.props.toggleNewPlace
    ) {
      if (marker) {
        marker.setMap(null);
        marker = null;
      }
      window.google.maps.event.clearListeners(map, 'click');
      this.setState({ btnText: 'Add New Restaurant' });
    }
  }

  handleSubmit() {}

  handleCancel() {}

  render() {
    return (
      <div className="row">
        <div className="col">
          <button
            onClick={() => {
              this.handleSubmit();
              this.props.handleClick();
            }}
            type="submit"
            className="btn btn-warning btn-lg btn-block"
          >
            {this.state.btnText}
          </button>
        </div>
        {this.props.toggleNewPlace && (
          <div className="col">
            <button
              onClick={() => {
                this.handleCancel();
                // this.props.handleClick();
              }}
              type="cancel"
              className="btn btn-warning btn-lg btn-block"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default NewRestaurant;
