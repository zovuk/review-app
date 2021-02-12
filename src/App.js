import React, { Component } from 'react';
import Map from './components/map';
import List from './components/restaurantsList';
import Button from './components/seeListButton';
import NewRestaurant from './components/newRestaurant';
import Restaurant from './components/restaurant';
import Picture from './components/picture';
import './App.css';

class App extends Component {
  state = {
    idleListener: true,
    toggleNewPlace: false,
    restaurants: [],
    bounds: {},
    selectedRestaurantID: '',
    selectedRestaurantCoors: {},
    newPlace: {
      name: '',
      vicinity: '',
      place_id: '',
      geometry: {},
      save: false,
    },
  };

  onBoundsChange = (bounds) => {
    this.setState({ bounds: bounds });
  };

  filteredList = (filteredList) => {
    this.setState({ restaurants: filteredList });
  };

  handleMouseOver = (event) => {
    this.setState({ selectedRestaurantID: event.target.id });
    this.setState({
      selectedRestaurantCoors: this.state.restaurants.find(
        (e) => e.place_id === event.target.id
      ).geometry.location,
    });
  };

  handleMouseOut = (event) => {
    this.setState({ selectedRestaurantID: undefined });
  };

  handleClick = () => {
    this.setState({
      idleListener: this.state.idleListener ? false : true,
    });
  };

  toggleNewPlace = (e) => {
    this.setState({
      toggleNewPlace: this.state.toggleNewPlace ? false : true,
    });
  };

  addNewPlace = (value) => {
    this.setState({ newPlace: Object.assign({}, this.state.newPlace, value) });
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
              toggleNewPlace={this.state.toggleNewPlace}
              onBoundsChange={this.onBoundsChange}
            />
            {!this.state.idleListener && (
              <Button handleClick={this.handleClick}></Button>
            )}
            {!this.state.idleListener && (
              <Picture
                selectedRestaurantID={this.state.selectedRestaurantID}
                selectedRestaurantCoors={this.state.selectedRestaurantCoors}
              />
            )}
          </div>

          <div
            className={this.state.idleListener ? 'scroll col-md-4' : 'col-md-8'}
          >
            {this.state.idleListener && (
              <NewRestaurant
                handleClick={this.toggleNewPlace}
                toggleNewPlace={this.state.toggleNewPlace}
                addNewPlace={this.addNewPlace}
                newPlace={this.state.newPlace}
              ></NewRestaurant>
            )}
            {this.state.idleListener && !this.state.toggleNewPlace && (
              <List
                newBounds={this.state.bounds}
                filteredList={this.filteredList}
                restaurants={this.state.restaurants}
                handleMouseOver={this.handleMouseOver}
                handleMouseOut={this.handleMouseOut}
                handleClick={this.handleClick}
                newPlace={this.state.newPlace}
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
