import React, { Component } from 'react';
import Map from './components/map';
import List from './components/restaurantsList';
import Button from './components/seeListButton';
import Restaurant from './components/restaurant';
import './App.css';

class App extends Component {
  state = {
    fetchedList: [],
    idleListener: true,
  };

  fetchList = (results) => {
    const fetchedRestaurantList = JSON.stringify(results);
    this.setState({ fetchedList: JSON.parse(fetchedRestaurantList) });
  };

  onBoundsChange = (bounds) => {
    this.setState({ bounds: bounds });
  };

  filteredList = (filteredList) => {
    this.setState({ restaurants: filteredList });
  };

  handleMouseOver = (event) => {
    this.setState({ selectedRestaurantID: event.target.id });
  };

  handleMouseOut = (event) => {
    this.setState({ selectedRestaurantID: undefined });
  };

  handleClick = () => {
    this.setState({
      idleListener: this.state.idleListener ? false : true,
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row position-relative">
          <div className={this.state.idleListener ? 'col-md-8' : 'col-md-4'}>
            <Map
              id="myMap"
              restaurants={this.state.restaurants}
              newBounds={this.state.bounds}
              selectedRestaurantID={this.state.selectedRestaurantID}
              idleListener={this.state.idleListener}
              onFetch={this.fetchList}
              onBoundsChange={this.onBoundsChange}
            />
            {!this.state.idleListener && (
              <Button handleClick={this.handleClick}></Button>
            )}
          </div>

          <div
            className={this.state.idleListener ? 'scroll col-md-4' : 'col-md-8'}
          >
            {this.state.idleListener && (
              <List
                // className={'list'}
                newFetchedList={this.state.fetchedList}
                newBounds={this.state.bounds}
                filteredList={this.filteredList}
                restaurants={this.state.restaurants}
                handleMouseOver={this.handleMouseOver}
                handleMouseOut={this.handleMouseOut}
                handleClick={this.handleClick}
              />
            )}
            {!this.state.idleListener && (
              <Restaurant
                selectedRestaurantID={this.state.selectedRestaurantID}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
