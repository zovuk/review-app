import React, { Component } from 'react';
import Map from './components/map';
import List from './components/restaurantsList';
import Button from './components/btnBackOnList';
import BtnAddRestaurant from './components/btnAddRestaurant';
import AddRestaurant from './components/addRestaurant';
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
      name: '...',
      vicinity: '...',
      place_id: '',
      geometry: {},
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

  handleClick = (e) => {
    this.setState({
      idleListener: this.state.idleListener ? false : true,
    });
  };

  toggleNewPlace = () => {
    this.setState({
      toggleNewPlace: this.state.toggleNewPlace ? false : true,
    });
  };

  addNewPlace = (e) => {
    this.setState({
      newPlace: e,
    });
  };

  render() {
    return (
      <div className="container  mt-2">
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

          <div className={this.state.idleListener ? 'col-md-4' : 'col-md-8'}>
            {!this.state.toggleNewPlace && this.state.idleListener && (
              <div className="p-3 mb-3 rounded shadow">
                <div className="row pl-3 pr-3">
                  <BtnAddRestaurant
                    handleClick={this.toggleNewPlace}
                  ></BtnAddRestaurant>
                  <div className="col ml-3 shadow rounded border-secondary">
                    FILTER
                  </div>
                </div>
              </div>
            )}

            {this.state.toggleNewPlace && (
              <div className="p-3 rounded shadow">
                <AddRestaurant
                  handleClick={this.toggleNewPlace}
                  toggleNewPlace={this.state.toggleNewPlace}
                  addNewPlace={this.addNewPlace}
                  onBoundsChange={this.onBoundsChange}
                ></AddRestaurant>
              </div>
            )}
            {this.state.idleListener && !this.state.toggleNewPlace && (
              <div className="scroll p-3 rounded shadow">
                <List
                  toggleNewPlace={this.state.toggleNewPlace}
                  newBounds={this.state.bounds}
                  filteredList={this.filteredList}
                  restaurants={this.state.restaurants}
                  handleMouseOver={this.handleMouseOver}
                  handleMouseOut={this.handleMouseOut}
                  handleClick={this.handleClick}
                  newPlace={this.state.newPlace}
                />
              </div>
            )}

            {!this.state.idleListener && (
              <Restaurant
                selectedRestaurantID={this.state.selectedRestaurantID}
                restaurants={this.state.restaurants}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
