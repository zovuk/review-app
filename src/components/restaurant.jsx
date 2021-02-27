import React, { Component } from 'react';
import AddReview from './addReview';
import { map } from './map';

class Restaurant extends Component {
  state = {
    selectedPlace: this.props.restaurants.find(
      (e) => e.place_id === this.props.selectedRestaurantID
    ),
    onlyNewData: [],
    addReview: false,
    disabled: false,
  };

  componentDidMount = async () => {
    // console.log(
    //   this.props.restaurants.find(
    //     (e) => e.place_id === this.props.selectedRestaurantID
    //   )
    // );
    // get user added data
    if (this.props.onlyNewData) {
      let a = this.props.onlyNewData.find(
        (e) => e.place_id === this.props.selectedRestaurantID
      );
      if (a) {
        await this.setState({ onlyNewData: a });
      }
    }

    let selectedPlace = this.state.selectedPlace;

    // old + new reviews from google places
    if (selectedPlace.from === 'google') {
      const request = {
        placeId: this.props.selectedRestaurantID,
        fields: ['review'],
      };
      let service = new window.google.maps.places.PlacesService(map);
      service.getDetails(request, this.getReviews);
    }

    // old + new reviews from JSON and new restaurants
    if (selectedPlace.from !== 'google') {
      const pulledDetails = selectedPlace.reviews ? selectedPlace : {};
      const newData = this.state.onlyNewData.reviews
        ? this.state.onlyNewData.reviews
        : [];
      this.finalData(pulledDetails, newData);
    }
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.onlyNewData !== this.props.onlyNewData) {
      let a = this.props.onlyNewData.find(
        (e) => e.place_id === this.props.selectedRestaurantID
      );
      if (a) {
        await this.setState({ onlyNewData: a });
      }
    }

    // update list ako je from google places
    if (
      prevProps.onlyNewData !== this.props.onlyNewData &&
      this.state.selectedPlace.from === 'google'
    ) {
      const request = {
        placeId: this.props.selectedRestaurantID,
        fields: ['review'],
      };
      let service = new window.google.maps.places.PlacesService(map);
      service.getDetails(request, this.getReviews);
    }

    // ipdate list ako je iz JSON ili new restaurant
    if (
      prevProps.onlyNewData !== this.props.onlyNewData &&
      this.state.selectedPlace.from !== 'google'
    ) {
      const pulledDetails = this.state.selectedPlace.reviews
        ? this.state.selectedPlace
        : {};
      let newData = this.state.onlyNewData.reviews
        ? [
            this.state.onlyNewData.reviews[
              this.state.onlyNewData.reviews.length - 1
            ],
          ]
        : [];
      this.finalData(pulledDetails, newData);
    }
  };

  // ########## getting reviews from google ##########
  getReviews = (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      const pulledDetails = JSON.parse(JSON.stringify(results));
      const newData = this.state.onlyNewData.reviews
        ? this.state.onlyNewData.reviews
        : [];
      this.finalData(pulledDetails, newData);
    }
  };

  finalData = (pulledDetails, newData) => {
    console.log(
      this.props.restaurants.find(
        (e) => e.place_id === this.props.selectedRestaurantID
      ).user_ratings_total
    );
    const oldData = pulledDetails.reviews ? pulledDetails.reviews : [];
    this.setState({
      selectedPlace: {
        ...this.state.selectedPlace,
        reviews: [...newData, ...oldData],
      },
    });
  };

  // ########## add new review ##########
  handleAddReview = (e) => {
    this.setState({
      addReview: this.state.addReview ? false : true,
      disabled: this.state.disabled ? false : true,
    });
    if (e && e.author_name) {
      let newReview = e;
      newReview.place_id = this.props.selectedRestaurantID;
      this.props.handleAddReview(newReview);
    }
    // this.setReviews();
  };

  getHumanTime = (timestamp) => {
    const time = Math.abs(timestamp);
    let humanTime, units;

    if (time > 1000 * 60 * 60 * 24 * 365) {
      humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 365), 10);
      units = 'years ago';
    } else if (time > 1000 * 60 * 60 * 24 * 30) {
      humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 30), 10);
      units = 'months ago';
    } else if (time > 1000 * 60 * 60 * 24 * 7) {
      humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 7), 10);
      units = 'weeks ago';
    } else if (time > 1000 * 60 * 60 * 24) {
      humanTime = parseInt(time / (1000 * 60 * 60 * 24), 10);
      units = 'days ago';
    } else if (time > 1000 * 60 * 60) {
      humanTime = parseInt(time / (1000 * 60 * 60), 10);
      units = 'hours ago';
    } else if (time > 1000 * 60) {
      humanTime = parseInt(time / (1000 * 60), 10);
      units = 'minutes ago';
    } else if (time > 1000) {
      humanTime = parseInt(time / 1000, 10);
      units = 'seconds ago';
    } else {
      humanTime = 'few';
      units = 'moments ago';
    }

    return humanTime + ' ' + units;
  };

  render() {
    return (
      <React.Fragment>
        <div className="text-shadow bg-light display-4 mb-3 p-2 text-break rounded shadow">
          {this.state.selectedPlace.name}
        </div>

        <div className="row">
          <div className="col minHeight pl-4">
            <div className="mb-2">{this.state.selectedPlace.vicinity}</div>
            <div className="mb-3">
              {this.state.selectedPlace.user_ratings_total !== 0 && (
                <div className="text-muted">
                  {this.state.selectedPlace.rating}
                  <span className="text-danger">&#9733;</span> (
                  {this.state.selectedPlace.user_ratings_total} total)
                </div>
              )}
              {this.state.selectedPlace.user_ratings_total === 0 && (
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

        {this.state.selectedPlace.reviews &&
          this.state.selectedPlace.reviews.map((review) => (
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
