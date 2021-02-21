import React, { Component } from 'react';
import { theKey } from './apiKey';

class Picture extends Component {
  render() {
    const srcURL =
      'https://maps.googleapis.com/maps/api/streetview?size=600x600&location=' +
      this.props.selectedRestaurantCoors.lat +
      ',' +
      this.props.selectedRestaurantCoors.lng +
      '&key=' +
      theKey;
    return (
      <div>
        <img
          src={srcURL}
          className="img-fluid border rounded mb-3"
          alt=""
        ></img>
      </div>
    );
  }
}

export default Picture;
