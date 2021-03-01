import React, { Component } from 'react';

class Stars extends Component {
  state = { stars: [] };

  componentDidMount() {
    let stars = [],
      i = 0;
    while (i < this.props.rating) {
      stars.push(
        <span key={Math.random() * 1000} className="text-danger">
          &#9733;
        </span>
      );
      i++;
    }
    this.setState({ stars: stars });
  }

  render() {
    return <React.Fragment>{this.state.stars.map((e) => e)}</React.Fragment>;
  }
}

export default Stars;
