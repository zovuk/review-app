import React, { Component } from 'react';

class Button extends Component {
  render() {
    return (
      <div>
        <button
          onClick={this.props.handleClick}
          type="button"
          className="btn btn-warning btn-lg btn-block mb-3 shadow"
        >
          Back on the List
        </button>
      </div>
    );
  }
}

export default Button;
