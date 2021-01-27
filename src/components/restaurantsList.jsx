import React, { Component } from 'react';
import LocalList from '../data/sample.json';

const list = JSON.stringify(LocalList);
const defaultlList = JSON.parse(list);

class List extends Component {
  state = { restaurants: defaultlList };

  componentDidUpdate(a, b, c) {
    // ##########  Check if bounds are changed ##########
    if (this.props.newBounds !== a.newBounds) {
      // ########## If yes start with local list ##########
      this.setState({
        restaurants: [
          ...defaultlList.filter(
            (e) =>
              e.geometry.location.lng < this.props.newBounds.ne.lng &&
              e.geometry.location.lng > this.props.newBounds.sw.lng &&
              e.geometry.location.lat < this.props.newBounds.ne.lat &&
              e.geometry.location.lat > this.props.newBounds.sw.lat
          ),
        ],
      });
    }

    // ########## Check if new fetched list is different ##########
    if (this.props.newFetchedList !== a.newFetchedList) {
      // ########## If yes add fetched list ##########
      this.setState({
        restaurants: [
          ...defaultlList.filter(
            (e) =>
              e.geometry.location.lng < this.props.newBounds.ne.lng &&
              e.geometry.location.lng > this.props.newBounds.sw.lng &&
              e.geometry.location.lat < this.props.newBounds.ne.lat &&
              e.geometry.location.lat > this.props.newBounds.sw.lat
          ),
          ...this.props.newFetchedList,
        ],
      });
    }

    // ########## Filter only locations inside the boundaries ##########

    // this.setState({ restaurants: tempList });
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
