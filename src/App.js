import React, { Component } from 'react';
import Map from './components/map';
import BtnAddRestaurant from './components/btnAddRestaurant';
import Range from './components/range';
import List from './components/restaurantsList';
import Button from './components/btnBackOnList';
import Restaurant from './components/restaurant';
import NewRestaurant from './components/addRestaurant';
import Picture from './components/picture';
import './styles/App.css';

class App extends Component {
  state = {
    onlyNewData: false, // novi restorani, novi rejtinzi, nove recenzije
    searchRestaurants: true, // trazenje vidljivih restorana
    restaurants: [], // finalna lista restorana
    bounds: {},
    selectedRestaurantID: '',
    selectedRestaurantCoors: {},
    newPlace: {
      toggle: false,
      name: 'Name...',
      place_id: '',
      vicinity: 'Address...',
      geometry: {},
      rating: 0,
      user_ratings_total: 0,
    },
    handleRange: [0, 5],
  };

  // ########## add new review ##########
  handleAddReview = (e) => {
    // prvi unos
    if (!this.state.onlyNewData) {
      this.setState({
        onlyNewData: [
          {
            place_id: e.place_id,
            reviews: [e],
            user_ratings_total: 1,
            rating: e.rating,
          },
        ],
      });
    } else {
      const saved = this.state.onlyNewData.find(
        (el) => el.place_id === this.state.selectedRestaurantID
      );
      // unos sljedece recenzije ako vec postoje druge
      if (saved) {
        const indx = this.state.onlyNewData
          .map((el) => el.place_id)
          .indexOf(this.state.selectedRestaurantID);
        let tempNewData = [...this.state.onlyNewData];
        if (tempNewData[indx].reviews) {
          tempNewData[indx].reviews = [...tempNewData[indx].reviews, e];
          tempNewData[indx].user_ratings_total =
            tempNewData[indx].user_ratings_total + 1;
          tempNewData[indx].rating = tempNewData[indx].rating + e.rating;
        } else {
          tempNewData[indx].reviews = [e];
          tempNewData[indx].user_ratings_total = 1;
          tempNewData[indx].rating = e.rating;
        }
        this.setState({
          onlyNewData: tempNewData,
        });
      }
      // unos ako nema tog restorana snimljenog
      if (!saved) {
        this.setState({
          onlyNewData: [
            ...this.state.onlyNewData,
            {
              place_id: e.place_id,
              reviews: [e],
              user_ratings_total: 1,
              rating: e.rating,
            },
          ],
        });
      }
    }
  };

  handleNewPlaceData = async (data) => {
    const defaultData = () =>
      this.setState({
        newPlace: {
          toggle: false,
          name: 'Name...',
          place_id: '',
          vicinity: 'Address...',
          geometry: {},
          rating: 0,
          user_ratings_total: 0,
        },
      });
    if (data === 'form') {
      this.setState({
        newPlace: {
          ...this.state.newPlace,
          toggle: true,
        },
      });
    } else if (data === 'cancel') {
      defaultData();
    } else if (data === 'submit') {
      let tempList = this.state.onlyNewData ? this.state.onlyNewData : [];
      tempList.push(this.state.newPlace);
      this.setState({ onlyNewData: tempList });
      await this.setState({
        newPlace: {
          ...this.state.newPlace,
          toggle: false,
        },
      });
      defaultData();
    } else {
      this.setState({ newPlace: { ...this.state.newPlace, ...data } });
    }
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
      searchRestaurants: this.state.searchRestaurants ? false : true,
    });
  };

  handleRange = (e) => {
    this.setState({ handleRange: e });
  };

  render() {
    return (
      <div className="container  mt-2">
        <div className="row position-relative">
          <div
            className={this.state.searchRestaurants ? 'col-md-8' : 'col-md-4'}
          >
            <Map
              id="myMap"
              restaurants={this.state.restaurants}
              newBounds={this.state.bounds}
              selectedRestaurantID={this.state.selectedRestaurantID}
              toggleSearchRestaurants={this.state.searchRestaurants}
              toggleNewPlace={this.state.newPlace.toggle}
              onBoundsChange={this.onBoundsChange}
            />
            {!this.state.searchRestaurants && (
              <Button handleClick={this.handleClick}></Button>
            )}
            {!this.state.searchRestaurants && (
              <Picture
                selectedRestaurantID={this.state.selectedRestaurantID}
                selectedRestaurantCoors={this.state.selectedRestaurantCoors}
              />
            )}
          </div>

          <div
            className={this.state.searchRestaurants ? 'col-md-4' : 'col-md-8'}
          >
            {!this.state.newPlace.toggle && this.state.searchRestaurants && (
              <div className="p-3 mb-3 rounded shadow">
                <div className="row pl-3 pr-3">
                  <BtnAddRestaurant
                    handleClick={() => this.handleNewPlaceData('form')}
                  ></BtnAddRestaurant>
                  <div className="col ml-3 shadow rounded border-secondary pt-2 pb-2">
                    <Range
                      showRange={this.state.handleRange}
                      handleRange={this.handleRange}
                    />
                  </div>
                </div>
              </div>
            )}

            {this.state.newPlace.toggle && (
              <div className="p-3 rounded shadow">
                <NewRestaurant
                  newPlaceData={this.state.newPlace}
                  handleNewPlaceData={this.handleNewPlaceData}
                  onBoundsChange={this.onBoundsChange}
                ></NewRestaurant>
              </div>
            )}
            {this.state.searchRestaurants && !this.state.newPlace.toggle && (
              <div className="scroll p-3 rounded shadow">
                <List
                  toggleNewPlace={this.state.newPlace.toggle}
                  newBounds={this.state.bounds}
                  filteredList={this.filteredList}
                  restaurants={this.state.restaurants}
                  handleMouseOver={this.handleMouseOver}
                  handleMouseOut={this.handleMouseOut}
                  handleClick={this.handleClick}
                  newPlace={this.state.newPlace}
                  selectedRestaurantID={this.state.selectedRestaurantID}
                  showRange={this.state.handleRange}
                  onlyNewData={this.state.onlyNewData}
                />
              </div>
            )}

            {!this.state.searchRestaurants && (
              <Restaurant
                selectedRestaurantID={this.state.selectedRestaurantID}
                restaurant={this.state.restaurants.find(
                  (e) => e.place_id === this.state.selectedRestaurantID
                )}
                handleAddReview={this.handleAddReview}
                onlyNewData={this.state.onlyNewData}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
