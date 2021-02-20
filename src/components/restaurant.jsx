import React, { Component } from 'react';
import AddReview from './addReview';
import { map } from './map';

let newReviews = [],
  reviews = [],
  place = {};
class Restaurant extends Component {
  state = {
    place: {},
    rating: 0,
    user_ratings_total: 0,
    reviews: [],
    addReview: false,
    disabled: false,
  };

  componentDidMount() {
    reviews = [];
    place = {};
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
      service.getDetails(request, this.getReviews);
    } else {
      place = this.props.restaurants.find(
        (e) => e.place_id === this.props.selectedRestaurantID
      );
      this.setReviews();
    }
  }

  setReviews = () => {
    let newRatings = 0;
    // provjera da li postoje reviews
    place.reviews ? (reviews = place.reviews) : (reviews = []);

    // ako nema review postavljanje na 0
    if (isNaN(place.user_ratings_total)) {
      place.rating = 0;
      place.user_ratings_total = 0;
    }

    // filtriranje samo novo dodanih review
    const filteredReviews = newReviews.filter(
      (e) => e.place_id === this.props.selectedRestaurantID
    );

    // ako postoje novi review zbroji rating
    if (filteredReviews.length > 0) {
      for (let i = 0; i < filteredReviews.length; i++) {
        newRatings = newRatings + filteredReviews[i].rating;
      }
    }

    // izracunaj novi rating na jednu decimalu
    newRatings =
      filteredReviews.length > 0
        ? Math.round(
            ((newRatings + place.rating) /
              (filteredReviews.length + (place.rating === 0 ? 0 : 1))) *
              10
          ) / 10
        : place.rating;

    // postavi state
    this.setState({
      place: place,
      reviews: [...filteredReviews, ...reviews],
      user_ratings_total: place.user_ratings_total + filteredReviews.length,
      rating: newRatings,
    });
  };

  getReviews = (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      place = JSON.parse(JSON.stringify(results));
      this.setReviews();
    }
  };

  handleAddReview = (e) => {
    this.setState({
      addReview: this.state.addReview ? false : true,
      disabled: this.state.disabled ? false : true,
    });
    if (e && e.author_name) {
      let newReview = e;
      newReview.place_id = this.props.selectedRestaurantID;
      newReviews.push(newReview);
      this.setReviews();
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="text-shadow bg-light display-4 mb-3 p-2 text-break rounded shadow">
          {this.state.place.name}
        </div>

        <div className="row">
          <div className="col minHeight pl-4">
            <div className="mb-2">
              {this.state.place.formatted_address}
              {this.state.place.vicinity}
            </div>
            <div className="mb-3">
              {this.state.user_ratings_total !== 0 && (
                <div className="text-muted">
                  {this.state.rating}
                  <span className="text-danger">&#9733;</span> (
                  {this.state.user_ratings_total} total)
                </div>
              )}
              {this.state.user_ratings_total === 0 && (
                <div className="text-muted">No Ratings or Reviews</div>
              )}
            </div>
          </div>
          <div className="col">
            <button
              type="submit"
              className="btn btn-warning btn-lg btn-block shadow"
              onClick={this.handleAddReview}
              disabled={this.state.disabled}
            >
              Add Review
            </button>
          </div>
        </div>

        {this.state.addReview && (
          <AddReview handleAddReview={this.handleAddReview} />
        )}

        {this.state.reviews &&
          this.state.reviews.map((review) => (
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
