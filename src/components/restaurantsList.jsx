import React, { Component } from 'react';
import { restaurants } from './localRestaurants';

class List extends Component {
  // state = {  }
  render() {
    return (
      <div className="mt-2">
        {' '}
        {restaurants.map((e) => (
          <div className="card bg-warning mt-1" key={e.id}>
            {e.name}
          </div>
        ))}
      </div>
    );
  }
}

export default List;
