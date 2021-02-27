import React, { Component } from 'react';
import noUiSlider from 'nouislider';
import '../styles/nouislider.css';

export default class Range extends Component {
  componentDidMount() {
    let slider = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [this.props.showRange[0], this.props.showRange[1]],
      connect: true,
      step: 1,
      range: {
        min: 0,
        max: 5,
      },
    });
    slider.addEventListener('click', () => {
      const getRange = slider.noUiSlider.get();
      this.props.handleRange([parseInt(getRange[0]), parseInt(getRange[1])]);
    });
  }

  render() {
    return (
      <React.Fragment>
        <div id="slider" className="mb-2"></div>
        <div>
          Visible ratings range:{' '}
          <strong>
            {this.props.showRange[0]} - {this.props.showRange[1]}
          </strong>
        </div>
      </React.Fragment>
    );
  }
}
