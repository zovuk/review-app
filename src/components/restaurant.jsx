import React, { Component } from 'react';
import { map } from './map';

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
        <div className="text-shadow bg-light display-4 mb-3 p-2 text-break rounded shadow">
          {this.state.place.name}
        </div>
        <div className=" mb-2">{this.state.place.formatted_address}</div>
        <div className=" mb-3">
          {this.state.place.rating && (
            <div className="text-muted">
              {this.state.place.rating}
              <span className="text-danger">&#9733;</span> (
              {this.state.place.user_ratings_total} total reviews)
            </div>
          )}
          {!this.state.place.rating && (
            <div className="text-muted">No Ratings or Reviews</div>
          )}
        </div>
        {this.state.place.reviews &&
          this.state.place.reviews.map((review) => (
            <div className="card mb-3 shadow" key={Math.random() * 1000}>
              <div className="card-body pl-1">
                <div className="pl-3 card-subtitle mb-2">
                  {review.rating && (
                    <div>
                      <h5 className="card-title pb-0">{review.author_name}</h5>
                      <p>
                        {review.rating}
                        <span className="text-danger">&#9733; ... </span>
                        {review.relative_time_description}
                      </p>
                      <p>{review.text}</p>
                    </div>
                  )}
                  {!review.rating && <div>No Ratings</div>}
                </div>
              </div>
            </div>
          ))}
      </React.Fragment>
    );
  }
}

export default Restaurant;
