import React, { Component } from 'react';
import LocalList from '../data/sample.json';
import { map } from './map';

const list = JSON.stringify(LocalList);
let defaultlList = JSON.parse(list);
let listRight = [];
const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖß123456789';
let labelIndex = 0;
let newRatings = [];
class List extends Component {
  state = { listItemBg: 'bg-light' };

  // ########## Filter-out all non-visible restaurants ##########
  filterIt = (newBounds) => {
    // ########## Get restaurants from google places Nearby search ##########
    let restaurants = [];
    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        bounds: newBounds,
        type: ['restaurant'],
      },
      (results) => {
        restaurants = JSON.parse(JSON.stringify(results));
        restaurants.map((e) => (e.from = 'google'));

        // ########## Filter only reataurants inside boundaries ##########
        let filteredList = [...defaultlList, ...restaurants].filter(
          (e) =>
            e.geometry.location.lng < newBounds.getNorthEast().lng() &&
            e.geometry.location.lng > newBounds.getSouthWest().lng() &&
            e.geometry.location.lat < newBounds.getNorthEast().lat() &&
            e.geometry.location.lat > newBounds.getSouthWest().lat()
        );
        filteredList.map(
          (e) => (e.label = labels[labelIndex++ % labels.length])
        );

        // ########## creating list for rendering ##########
        listRight = [...filteredList];
        listRight.map((e, indx) => {
          if (newRatings.find((r) => e.place_id === r.place_id)) {
            listRight[indx] = {
              ...e,
              ...newRatings.find((r) => e.place_id === r.place_id),
            };
          }
          return null;
        });
        labelIndex = 0;
        this.props.filteredList(filteredList);
      }
    );
  };

  componentDidMount() {
    // ########## saving every new rating score ##########
    newRatings.unshift(this.props.newRatings);

    // ########## add new restaurant on default local list ##########
    if (
      !defaultlList.find((e) => e.place_id === this.props.newPlace.place_id) &&
      this.props.newPlace.place_id !== ''
    ) {
      defaultlList.push(this.props.newPlace);
      this.filterIt(this.props.newBounds);
    }
  }

  componentDidUpdate(a) {
    // ########## Filter list again when bounds changed ##########
    if (this.props.newBounds !== a.newBounds) {
      this.filterIt(this.props.newBounds);
    }
  }

  componentWillUnmount() {
    if (this.props.toggleNewPlace) {
      this.props.filteredList([]);
    }
  }

  // ########## When pointer hover over list Item ##########
  handleMouseOver = (e) => {
    const item = document.getElementById(e.target.id);

    item.classList.remove('bg-light');
    item.classList.add('bg-warning', 'border-danger', 'shadow');
  };

  // ########## When pointer go out from list Item ##########
  handleMouseOut = (e) => {
    const item = document.getElementById(e.target.id);

    item.classList.remove('bg-warning', 'border-danger', 'shadow');
    item.classList.add('bg-light');
  };

  render() {
    return (
      <div id="list">
        {listRight &&
          listRight.map((e) => (
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
                'slowTransition card ml-2 mb-2 pt-1 pb-1 bg-light border-dark'
              }
              key={e.place_id}
              id={e.place_id}
            >
              <div className="notClickable row">
                <div className="notClickable label rounded-left">{e.label}</div>
                <div className="notClickable col-10 h6 pl-1 text-truncate">
                  "{e.name}"
                </div>
              </div>
              <div className="notClickable pl-3">
                {e.user_ratings_total > 0 && (
                  <div className="notClickable text-muted">
                    {e.rating}
                    <span className="text-danger">&#9733;</span> (
                    {e.user_ratings_total})
                  </div>
                )}
                {!e.rating && (
                  <div className="notClickable text-secondary">No Ratings</div>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default List;
