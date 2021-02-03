import React, { Component } from 'react';
import LocalList from '../data/sample.json';

const list = JSON.stringify(LocalList);
const defaultlList = JSON.parse(list);
let onlyOnce = 1;
const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let labelIndex = 0;
class List extends Component {
  state = { listItemBg: 'bg-light' };
  // ########## Filter only reataurants inside boundaries ##########
  filterIt = () => {
    let filteredList = [...defaultlList, ...this.props.newFetchedList].filter(
      (e) =>
        e.geometry.location.lng < this.props.newBounds.ne.lng &&
        e.geometry.location.lng > this.props.newBounds.sw.lng &&
        e.geometry.location.lat < this.props.newBounds.ne.lat &&
        e.geometry.location.lat > this.props.newBounds.sw.lat
    );
    filteredList.map((e) => (e.label = labels[labelIndex++ % labels.length]));
    labelIndex = 0;
    this.props.filteredList(filteredList);
  };

  componentDidUpdate(a) {
    // ########## First call - only once ##########
    if (this.props.newFetchedList !== a.newFetchedList && onlyOnce === 1) {
      this.filterIt();
      onlyOnce += 1;
    }

    // ##########  Check if bounds are changed ##########
    if (this.props.newBounds !== a.newBounds) {
      this.filterIt();
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
              className={'slowTransition card mt-1 pl-1 bg-light'}
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
