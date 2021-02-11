import React, { Component } from "react";

class Stars extends Component {
  constructor(props) {
    super(props);
    this.state = { renderThis: [] };
  }

  componentDidMount() {
    if (this.props.average) {
      this.calcSpread(this.props.average);
    } else if (!this.props.average) {
      this.spreadStars([0, 0, 0, 0, 0]);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.average > prevProps.average) |
      (this.props.average < prevProps.average)
    ) {
      this.calcSpread(this.props.average);
    }
  }

  calcSpread = rating => {
    const base = [1, 2, 3, 4, 5];
    let result = [];
    base.map((el, index) => {
      if (rating >= el) {
        result[index] = 2;
      } else if (rating < el && rating >= el - 0.5) {
        result[index] = 1;
      } else if ((rating === 0) | (rating < el)) {
        result[index] = 0;
      }
      return null;
    });
    this.spreadStars(result);
  };

  spreadStars = likeThis => {
    let result = [];
    likeThis.map((el, index) => {
      if (el === 2) {
        result[index] = (
          <div className="stars-empty" key={index}>
            &#9733;<div className="stars-full">&#9733;</div>
          </div>
        );
      } else if (el === 1) {
        result[index] = (
          <div className="stars-empty" key={index}>
            &#9733;<div className="stars-half">&#9733;</div>
          </div>
        );
      } else if (el === 0) {
        result[index] = (
          <div className="stars-empty" key={index}>
            &#9733;
          </div>
        );
      }
      return null;
    });
    this.setState({ renderThis: result });
  };

  render() {
    return (
      <>
        {!this.props.hidden ? (
          <div className="stars">{this.state.renderThis}</div>
        ) : (
          <div className="stars space-around">{this.state.renderThis}</div>
        )}
      </>
    );
  }
}

export default Stars;
