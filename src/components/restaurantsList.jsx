import React, { Component } from 'react';
import LocalList from '../data/sample.json';

const list = JSON.stringify(LocalList);
const defaultlList = JSON.parse(list);
let onlyOnce = 1;

class List extends Component {
  // ########## Filter only reataurants inside boundaries ##########
  filterIt = (list) => [
    ...list.filter(
      (e) =>
        e.geometry.location.lng < this.props.newBounds.ne.lng &&
        e.geometry.location.lng > this.props.newBounds.sw.lng &&
        e.geometry.location.lat < this.props.newBounds.ne.lat &&
        e.geometry.location.lat > this.props.newBounds.sw.lat
    ),
  ];

  componentDidUpdate(a) {
    // ########## Initial check if new fetched list is different ##########
    if (this.props.newFetchedList !== a.newFetchedList && onlyOnce === 1) {
      this.props.onListChange(
        this.filterIt([...defaultlList, ...this.props.newFetchedList])
      );
      onlyOnce += 1;
    }

    // ##########  Check if bounds are changed ##########
    if (this.props.newBounds !== a.newBounds) {
      this.props.onListChange(
        this.filterIt([...defaultlList, ...this.props.newFetchedList])
      );
    }
  }

  render() {
    return (
      <div className="mt-2">
        {this.props.restaurants.map((e) => (
          <div className="card bg-warning mt-1" key={e.place_id}>
            {e.name}
          </div>
        ))}
      </div>
    );
  }
}

export default List;
