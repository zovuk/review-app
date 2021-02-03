import React, { Component } from 'react';

class Review extends Component {
  // state = {  }
  componentDidMount() {
    console.log(this.props.review);
  }
  render() {
    return <div></div>;
    // return this.props.review.map((review) => (
    //   <div>
    //     <div>{review.author_name}</div>
    //     {/* <div>{review.profile_photo_url}</div> */}
    //     {/* <div>{review.author_url}</div> */}
    //     <div>{review.rating}</div>
    //     <div>{review.relative_time_description}</div>
    //     <div>{review.text}</div>
    //     {/* <div>{review.time}</div> */}
    //   </div>
    // ));
  }
}

export default Review;
