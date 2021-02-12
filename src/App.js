import React, { Component } from 'react';
import Map from './components/map';
import List from './components/restaurantsList';
import Button from './components/seeListButton';
import NewRestaurant from './components/newRestaurant';
import Restaurant from './components/restaurant';
import Picture from './components/picture';
// import FilterStars from './components/filterStars';
import './App.css';

class App extends Component {
  state = {
    idleListener: true,
    addingRestaurant: false,
    restaurants: [],
    bounds: {},
    selectedRestaurantID: '',
    selectedRestaurantCoors: {},
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

  handleAddRestaurant = () => {
    this.setState({
      addingRestaurant: this.state.addingRestaurant ? false : true,
    });
  };

  // addNewPlace = (a, b) => {
  //   this.setObjectByPath([newPlace, a], b);
  //   console.log(this.state.newPlace);
  // };

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
              addingRestaurant={this.state.addingRestaurant}
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
            {/* {!this.state.addingRestaurant && (
              <FilterStars
                onMinChange={console.log('minimal')}
                onMaxChange={console.log('maximal')}
                minStars={1}
                maxStars={3}
                hidden={true}
              />
            )} */}
            {this.state.idleListener && (
              <NewRestaurant
                // idleListener={this.state.idleListener}
                handleClick={this.handleAddRestaurant}
                addingRestaurant={this.state.addingRestaurant}
                // addNewPlace={this.addNewPlace}
              ></NewRestaurant>
            )}
            {this.state.idleListener && !this.state.addingRestaurant && (
              <List
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
