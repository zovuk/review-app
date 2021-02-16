import React, { Component } from 'react';
import { map } from './map';
// import Review from './reviews';

class Restaurant extends Component {
  state = { place: {} };

  componentDidMount() {
    if (
      this.props.restaurants.find(
        (e) =>
          e.place_id === this.props.selectedRestaurantID && e.from === 'google'
      )
    ) {
      const request = {
        placeId: this.props.selectedRestaurantID,
        fields: [
          'name',
          'review',
          'user_ratings_total',
          'rating',
          'formatted_address',
        ],
      };
      let service = new window.google.maps.places.PlacesService(map);
      service.getDetails(request, this.callback);
    } else {
      this.setState({
        place: this.props.restaurants.find(
          (e) => e.place_id === this.props.selectedRestaurantID
        ),
      });
    }
  }

  callback = (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      this.setState({ place: JSON.parse(JSON.stringify(results)) });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="display-3 text-wrap">{this.state.place.name}</div>
        <div>{this.state.place.formatted_address}</div>
        <div>
          {this.state.place.rating && (
            <div className="notClickable text-secondary">
              {this.state.place.rating}
              <span className="text-danger">&#9733;</span> (
              {this.state.place.user_ratings_total})
            </div>
          )}
          {!this.state.place.rating && (
            <div className="notClickable text-secondary">No Ratings</div>
          )}
        </div>
        {this.state.place.reviews &&
          this.state.place.reviews.map((review) => (
            <div key={Math.random() * 10000000}>
              <div>{review.author_name}</div>
              {/* <div>{review.profile_photo_url}</div> */}
              {/* <div>{review.author_url}</div> */}
              <div>{review.rating}</div>
              <div>{review.relative_time_description}</div>
              <div>{review.text}</div>
              {/* <div>{review.time}</div> */}
            </div>
          ))}
      </React.Fragment>
    );
  }
}

export default Restaurant;
