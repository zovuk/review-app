import React, { Component } from 'react';
import { map } from './map';

let marker;
class NewRestaurant extends Component {
  state = {
    name: 'New Restaurant',
    vicinity: '...',
    place_id: '',
    location: {},
  };
  componentDidMount() {
    window.google.maps.event.addListener(map, 'click', (e) => {
      this.setState({
        geometry: { location: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
      });

      new window.google.maps.Geocoder().geocode(
        { location: this.state.geometry.location },
        (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              // If marker existed remove it
              if (marker) {
                marker.setMap(null);
              }

              // Add new Marker
              marker = new window.google.maps.Marker({
                position: this.state.geometry.location,
                title: this.state.name,
                map,
              });

              // Address + ID of new Place
              this.setState({ vicinity: results[0].formatted_address });
              this.setState({ place_id: results[0].place_id });
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

  handleSubmit = (e) => {
    this.props.addNewPlace(this.state);
    e.preventDefault();
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
    window.google.maps.event.clearListeners(map, 'click');
    this.props.onBoundsChange(map.getBounds());
    this.props.handleClick();
  };

  handleCancel = (e) => {
    this.props.addNewPlace({ place_id: '' });
    e.preventDefault();
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
    window.google.maps.event.clearListeners(map, 'click');
    this.props.onBoundsChange(map.getBounds());
    this.props.handleClick();
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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
              value={this.state.name}
              placeholder="Enter name here"
              onChange={(e) => this.handleChange(e)}
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="inputRestaurantAddress">Address:</label>
            <input
              name="vicinity"
              className="form-control"
              id="inputRestaurantAddress"
              value={this.state.vicinity}
              onChange={(e) => this.handleChange(e)}
            ></input>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default NewRestaurant;
