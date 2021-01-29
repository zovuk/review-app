import React, { Component } from 'react';
import Map from './components/map';
import List from './components/restaurantsList';
import { options } from './components/options';
import './App.css';

class App extends Component {
  state = {
    fetchedList: [],
    bounds: {},
    restaurants: [],
  };

  fetchList = (results) => {
    const fetchedRestaurantList = JSON.stringify(results);
    this.setState({ fetchedList: JSON.parse(fetchedRestaurantList) });
  };

  onBoundsChange = (bounds) => {
    this.setState({ bounds: bounds });
  };

  onListChange = (filteredList) => {
    this.setState({ restaurants: filteredList });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <Map
              id="myMap"
              options={{
                center: options.defaultMapCenter,
                zoom: 15,
              }}
              onMapLoad={(map) => {
                map.setCenter(options.defaultMapCenter);
              }}
              onFetch={this.fetchList}
              onBoundsChange={this.onBoundsChange}
              restaurants={this.state.restaurants}
              newBounds={this.state.bounds}
            />
          </div>
          <div className="col-sm-4">
            <List
              newFetchedList={this.state.fetchedList}
              newBounds={this.state.bounds}
              onListChange={this.onListChange}
              restaurants={this.state.restaurants}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
