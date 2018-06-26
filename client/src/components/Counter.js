import React, { Component } from 'react';
import { connect } from 'react-redux';

class Counter extends Component {

  increment = () => {
    this.props.dispatch({type: 'INCREMENT'});
  };

  reset = () => {
    this.props.dispatch({type: 'RESET'});
  };

  submit = () => {
    this.props.dispatch({type: 'SUBMIT'});
  };

  render() {
    return (
        <div>
          <div>{this.props.count}</div>
          <button onClick={this.reset}>Reset</button>
          <button onClick={this.increment}>Increment</button>
          <button onClick={this.submit}>Submit</button>
        </div>
    );
  }
}

const mapStateToProps = state => ({
    count: state.count
});

export default connect(mapStateToProps)(Counter);
