import React, { Component } from 'react';
import { map } from './map';

let marker;
class NewRestaurant extends Component {
  state = { disabled: true };
  componentDidMount() {
    window.google.maps.event.addListener(map, 'click', (e) => {
      this.props.handleNewPlaceData({
        geometry: { location: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
      });

      new window.google.maps.Geocoder().geocode(
        { location: this.props.newPlaceData.geometry.location },
        (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              // If marker existed remove it
              if (marker) {
                marker.setMap(null);
              }

              // Add new Marker
              marker = new window.google.maps.Marker({
                position: this.props.newPlaceData.geometry.location,
                title: this.props.newPlaceData.name,
                map,
              });

              // Address + ID of new Place
              this.props.handleNewPlaceData({
                vicinity: results[0].formatted_address,
                place_id: results[0].place_id,
              });
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

  componentDidUpdate(prevProps) {
    if (
      prevProps.newPlaceData.geometry.location !==
        this.props.newPlaceData.geometry.location &&
      this.props.newPlaceData.geometry.location
    ) {
      this.setState({ disabled: false });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleNewPlaceData('submit');
    this.resetForm();
  };

  handleCancel = (e) => {
    e.preventDefault();
    this.props.handleNewPlaceData('cancel');
    this.resetForm();
  };

  handleChange = (e) => {
    this.props.handleNewPlaceData({
      [e.target.name]: e.target.value,
    });
  };

  resetForm = () => {
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
    window.google.maps.event.clearListeners(map, 'click');
    this.props.onBoundsChange(map.getBounds());
  };

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <button
                type="submit"
                className="btn btn-warning btn-lg btn-block shadow"
                disabled={this.state.disabled}
              >
                Submit
              </button>
            </div>
            <div className="col">
              <button
                onClick={(e) => {
                  this.handleCancel(e);
                }}
                type="cancel"
                className="btn btn-warning btn-lg btn-block shadow"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputRestaurantName">Restaurant Name: </label>

            <input
              name="name"
              className="form-control"
              id="inputRestaurantName"
              value={this.props.newPlaceData.name}
              placeholder="Enter name here"
              onChange={(e) => this.handleChange(e)}
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="inputRestaurantAddress">Restaurant Address:</label>
            <input
              name="vicinity"
              className="form-control"
              id="inputRestaurantAddress"
              value={this.props.newPlaceData.vicinity}
              onChange={(e) => this.handleChange(e)}
            ></input>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default NewRestaurant;
