import React, { Component } from 'react';
import LocalList from '../data/sample.json';

const list = JSON.stringify(LocalList);
const defaultlList = JSON.parse(list);

class List extends Component {
  state = { restaurants: defaultlList };

  componentDidUpdate(a) {
    // ########## Filter only reataurants inside boundaries ##########
    const nowList = [
      ...defaultlList.filter(
        (e) =>
          e.geometry.location.lng < this.props.newBounds.ne.lng &&
          e.geometry.location.lng > this.props.newBounds.sw.lng &&
          e.geometry.location.lat < this.props.newBounds.ne.lat &&
          e.geometry.location.lat > this.props.newBounds.sw.lat
      ),
    ];
    // ##########  Check if bounds are changed ##########
    if (this.props.newBounds !== a.newBounds) {
      // ########## If yes start with local list ##########
      this.setState({
        restaurants: nowList,
      });
    }

    // ########## Check if new fetched list is different ##########
    if (this.props.newFetchedList !== a.newFetchedList) {
      // ########## If yes add fetched list ##########
      this.setState({
        restaurants: [...nowList, ...this.props.newFetchedList],
      });
    }
  }

  render() {
    return (
      <div className="mt-2">
        {this.state.restaurants.map((e) => (
          <div className="card bg-warning mt-1" key={e.place_id}>
            {e.name}
          </div>
        ))}
      </div>
    );
  }
}

export default List;
