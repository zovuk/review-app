import React, { Component } from 'react';
import Stars from './stars';

class FilterStars extends Component {
  calcStarsSpread = (value) => {
    const base = [1, 2, 3, 4, 5];
    let result = [0, 0, 0, 0, 0];
    base.map((el, index) => {
      if (value <= el) {
        result[index] = 2;
      } else if (value > el) {
        result[index] = 0;
      }
      return null;
    });
  };

  render() {
    return (
      <div className="buttonDivUp" id="filterStars">
        <div>
          <div className="filterSpread">
            <Stars hidden={this.props.hidden} average={this.props.minStars} />
          </div>
          <input
            type="range"
            id="minRange"
            defaultValue={this.props.minStars}
            min="0"
            max={this.props.maxStars}
            onChange={(event) => this.props.onMinChange(event.target.value)}
          />
        </div>
        <div>
          <div className="filterSpread">
            <Stars hidden={this.props.hidden} average={this.props.maxStars} />
          </div>
          <input
            type="range"
            id="maxRange"
            defaultValue={this.props.maxStars}
            min={this.props.minStars}
            max="5"
            onChange={(event) => this.props.onMaxChange(event.target.value)}
          />
        </div>
      </div>
    );
  }
}

export default FilterStars;
