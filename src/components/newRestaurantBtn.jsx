import React, { Component } from 'react';

class NewRestaurantBtn extends Component {
  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.props.handleClick();
          }}
          type="submit"
          className="btn btn-warning btn-lg btn-block"
        >
          Add New Restaurant
        </button>
      </div>
    );
  }
}

export default NewRestaurantBtn;
