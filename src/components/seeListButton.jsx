import React, { Component } from 'react';

class Button extends Component {
  state = {};
  render() {
    return (
      <div>
        <button
          onClick={(e) => this.props.handleClick(e)}
          type="button"
          className="btn btn-warning btn-lg btn-block"
        >
          See List
        </button>
      </div>
    );
  }
}

export default Button;
