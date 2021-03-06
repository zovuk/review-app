import React, { Component } from 'react';

class AddReview extends Component {
  state = {
    author_name: '',
    rating: 5,
    text: '',
    time: 0,
    relative_time_description: 'sada',
    disabled: true, // ovo promjeniti u 'true'
  };

  componentDidUpdate(x, prevState) {
    if (
      prevState.author_name !== this.state.author_name &&
      this.state.author_name.length > 2
    ) {
      this.setState({ disabled: false });
    }
    if (
      prevState.author_name !== this.state.author_name &&
      this.state.author_name.length < 3
    ) {
      this.setState({ disabled: true });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.setState({ time: new Date().getTime(), disabled: true });
    this.props.handleAddReview(this.state);
  };

  handleCancel = async (e) => {
    e.preventDefault();
    await this.setState({ author_name: '', rating: 0, text: '', time: 0 });
    this.props.handleAddReview();
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]:
        e.target.name === 'rating' ? parseInt(e.target.value) : e.target.value,
    });
  };

  render() {
    return (
      <div className="card mb-3 shadow">
        <div className="card-body ">
          <form onSubmit={this.handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <button
                  type="submit"
                  className="btn btn-warning btn-lg btn-block shadow"
                  disabled={this.state.disabled}
                >
                  Submit
                </button>
              </div>
              <div className="col">
                <button
                  onClick={(e) => {
                    this.handleCancel(e);
                  }}
                  type="cancel"
                  className="btn btn-warning btn-lg btn-block shadow"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputRestaurantName" className="pl-3">
                <strong>Author Name: </strong>
              </label>

              <input
                name="author_name"
                className="form-control"
                id="inputAuthor_name"
                value={this.state.author_name}
                placeholder="Minimum 3 characters..."
                onChange={(e) => this.handleChange(e)}
              ></input>
            </div>

            <div className="card-body border rounded mb-3 mt-4 pb-1">
              <div className="form-group">
                <label htmlFor="rating">
                  <strong>Rating </strong>
                  <span className="text-muted">(use slider): </span>
                  <strong>
                    {' '}
                    {this.state.rating}
                    <span className="text-danger">&#9733;</span>
                  </strong>
                </label>
                <input
                  type="range"
                  className="form-control-range slider-width"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  value={this.state.rating}
                  onChange={(e) => this.handleChange(e)}
                ></input>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="inputRestaurantAddress" className="pl-3">
                <strong>Review:</strong>
              </label>
              <textarea
                name="text"
                className="form-control"
                id="inputText"
                value={this.state.text}
                placeholder="Enter your review here..."
                onChange={(e) => this.handleChange(e)}
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddReview;
