import React, { Component } from 'react';
import { theKey } from './apiKey';

class Picture extends Component {
  state = {
    toRender: '',
  };

  async componentDidMount() {
    let response = await fetch(this.srcURL('/metadata?'));

    if (response.ok) {
      // if HTTP-status is 200-299
      let json = await response.json();
      if (json.status === 'OK') {
        this.setState({
          toRender: (
            <div>
              <img
                src={this.srcURL('?size=600x600&')}
                className="img-fluid border rounded mb-3"
                alt=""
              ></img>
            </div>
          ),
        });
      }
    } else {
      alert('HTTP-Error: ' + response.status);
    }
  }

  srcURL = (ext) =>
    'https://maps.googleapis.com/maps/api/streetview' +
    ext +
    'location=' +
    this.props.selectedRestaurantCoors.lat +
    ',' +
    this.props.selectedRestaurantCoors.lng +
    '&key=' +
    theKey;

  render() {
    return <React.Fragment>{this.state.toRender}</React.Fragment>;
  }
}

export default Picture;
