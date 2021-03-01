import React, { Component } from 'react';
import LocalList from '../data/sample.json';
import { map } from './map';
import Stars from './stars';

const list = JSON.stringify(LocalList);
let defaultlList = JSON.parse(list);
const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖß123456789';
let labelIndex = 0;
class List extends Component {
  state = { listItemBg: 'bg-light' };

  componentDidMount() {
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
    if (
      a.restaurants !== this.props.restaurants &&
      this.props.restaurants.length === 0 &&
      document.getElementById('listParent').classList.contains('p-3')
    ) {
      document.getElementById('listParent').classList.remove('p-3');
    }
    if (
      a.restaurants !== this.props.restaurants &&
      a.restaurants.length === 0 &&
      !document.getElementById('listParent').classList.contains('p-3')
    ) {
      document.getElementById('listParent').classList.add('p-3');
    }
    // ########## Filter list again when bounds changed ##########
    if (this.props.newBounds !== a.newBounds) {
      this.filterIt(this.props.newBounds);
    }

    // ########## Filter ranges ##########
    if (a.showRange !== this.props.showRange) {
      this.filterIt(this.props.newBounds);
    }
  }

  componentWillUnmount() {
    if (this.props.toggleNewPlace) {
      this.props.filteredList([]);
    }
  }

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
        restaurants.map((e) => {
          e.from = 'google';
          if (!e.rating) {
            e.rating = 0;
            e.user_ratings_total = 0;
          }
          return null;
        });

        // ########## Filter only reataurants inside boundaries ##########
        let filteredList = [...defaultlList, ...restaurants].filter(
          (e) =>
            e.geometry.location.lng < newBounds.getNorthEast().lng() &&
            e.geometry.location.lng > newBounds.getSouthWest().lng() &&
            e.geometry.location.lat < newBounds.getNorthEast().lat() &&
            e.geometry.location.lat > newBounds.getSouthWest().lat() &&
            this.calcRating(e) >= this.props.showRange[0] &&
            Math.floor(this.calcRating(e)) < this.props.showRange[1] + 0.9
        );

        filteredList.map(
          (e) => (e.label = labels[labelIndex++ % labels.length])
        );

        labelIndex = 0;
        this.props.filteredList(filteredList);
      }
    );
  };

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

  calcRating = (e) => {
    let onlyNewData =
      this.props.onlyNewData &&
      this.props.onlyNewData.find((n) => n.place_id === e.place_id)
        ? this.props.onlyNewData.find((n) => n.place_id === e.place_id)
        : 0;
    return (
      Math.round(
        (onlyNewData.rating
          ? (e.rating + onlyNewData.rating) /
            (e.rating
              ? onlyNewData.user_ratings_total + 1
              : onlyNewData.user_ratings_total)
          : e.rating
          ? e.rating
          : 0) * 10
      ) / 10
    );
  };

  calcTotal = (e) => {
    let onlyNewData =
      this.props.onlyNewData &&
      this.props.onlyNewData.find((n) => n.place_id === e.place_id)
        ? this.props.onlyNewData.find((n) => n.place_id === e.place_id)
        : 0;
    return (
      Math.round(
        (!isNaN(onlyNewData.user_ratings_total)
          ? e.user_ratings_total + onlyNewData.user_ratings_total
          : e.user_ratings_total) * 10
      ) / 10
    );
  };

  render() {
    return (
      <div id="listParent" className="scroll p-3 rounded shadow">
        <div id="list">
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
                  'slowTransition card ml-2 mb-2 pt-1 pb-1 bg-light border-dark'
                }
                key={e.place_id}
                id={e.place_id}
              >
                <div className="notClickable row">
                  <div className="notClickable label rounded-left">
                    {e.label}
                  </div>
                  <div className="notClickable col-10 h6 pl-1 text-truncate">
                    "{e.name}"
                  </div>
                </div>
                <div className="notClickable pl-3">
                  {this.calcTotal(e) > 0 && (
                    <div className="notClickable text-muted">
                      {this.calcRating(e)}{' '}
                      <Stars rating={Math.floor(this.calcRating(e))} />
                      {' ('}
                      {this.calcTotal(e)} total)
                    </div>
                  )}
                  {!this.calcTotal(e) && (
                    <div className="notClickable text-secondary">
                      No Ratings
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default List;
