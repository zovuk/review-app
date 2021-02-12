import React, { Component } from 'react';
import LocalList from '../data/sample.json';
import { map } from './map';

const list = JSON.stringify(LocalList);
let defaultlList = JSON.parse(list);
const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖß123456789';
let labelIndex = 0;
class List extends Component {
  state = { listItemBg: 'bg-light' };
  filterIt = (newBounds) => {
    // ########## Get restaurants from google places Nearby search ##########
    let restaurants = [];
    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        bounds: map.getBounds(),
        type: ['restaurant'],
      },
      (results, status) => {
        restaurants = JSON.parse(JSON.stringify(results));

        // ########## Filter only reataurants inside boundaries ##########
        let filteredList = [...defaultlList, ...restaurants].filter(
          (e) =>
            e.geometry.location.lng < newBounds.ne.lng &&
            e.geometry.location.lng > newBounds.sw.lng &&
            e.geometry.location.lat < newBounds.ne.lat &&
            e.geometry.location.lat > newBounds.sw.lat
        );
        filteredList.map(
          (e) => (e.label = labels[labelIndex++ % labels.length])
        );
        labelIndex = 0;
        this.props.filteredList(filteredList);
      }
    );
  };

  componentDidUpdate(a) {
    // ##########  Check if bounds are changed ##########
    if (this.props.newBounds !== a.newBounds) {
      this.filterIt(this.props.newBounds);
    }
  }

  handleMouseOver = (e) => {
    const item = document.getElementById(e.target.id);

    item.classList.remove('bg-light');
    item.classList.add('bg-warning', 'border-danger');
  };

  handleMouseOut = (e) => {
    const item = document.getElementById(e.target.id);

    item.classList.remove('bg-warning', 'border-danger');
    item.classList.add('bg-light');
  };

  render() {
    return (
      <div id="list" className="mt-2">
        {this.props.restaurants &&
          this.props.restaurants.map((e) => (
            <div
              onMouseOver={(e) => {
                this.props.handleMouseOver(e);
                this.handleMouseOver(e);
              }}
              onMouseOut={(e) => {
                this.props.handleMouseOut(e);
                this.handleMouseOut(e);
              }}
              onClick={this.props.handleClick}
              className={
                'slowTransition card mt-1 pl-1 bg-light border-primary'
              }
              key={e.place_id}
              id={e.place_id}
            >
              <div className="notClickable row">
                <div className="notClickable label rounded-left">{e.label}</div>
                <div className="notClickable col-10 h6 text-truncate">
                  "{e.name}"
                </div>
              </div>
              {e.rating && (
                <div className="notClickable text-secondary">
                  {e.rating}
                  <span className="text-danger">&#9733;</span> (
                  {e.user_ratings_total})
                </div>
              )}
              {!e.rating && (
                <div className="notClickable text-secondary">No Ratings</div>
              )}
            </div>
          ))}
      </div>
    );
  }
}

export default List;
