import React, { Component } from 'react';
import LocalList from '../data/sample.json';

const list = JSON.stringify(LocalList);
const defaultlList = JSON.parse(list);
let onlyOnce = 1;
const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let labelIndex = 0;
class List extends Component {
  // ########## Filter only reataurants inside boundaries ##########
  filterIt = () => {
    let ppp = [...defaultlList, ...this.props.newFetchedList].filter(
      (e) =>
        e.geometry.location.lng < this.props.newBounds.ne.lng &&
        e.geometry.location.lng > this.props.newBounds.sw.lng &&
        e.geometry.location.lat < this.props.newBounds.ne.lat &&
        e.geometry.location.lat > this.props.newBounds.sw.lat
    );
    ppp.map((e) => (e.label = labels[labelIndex++ % labels.length]));
    labelIndex = 0;
    this.props.onListChange(ppp);
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

  render() {
    return (
      <div className="mt-2">
        {this.props.restaurants &&
          this.props.restaurants.map((e) => (
            <div className="card bg-warning mt-1 pl-1" key={e.place_id}>
              {e.label} {e.name}
            </div>
          ))}
      </div>
    );
  }
}

export default List;
