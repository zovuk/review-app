import React, { Component } from 'react';

class NewRestaurantBtn extends Component {
  render() {
    return (
      <div>
        <button
          data-toggle="tooltip"
          title="Add New Restaurant!"
          onClick={() => {
            this.props.handleClick();
          }}
          type="submit"
          className="btn btn-warning btn-lg btn-block shadow col"
        >
          NEW
        </button>
      </div>
    );
  }
}

export default NewRestaurantBtn;
