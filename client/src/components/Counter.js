import React, { Component } from 'react';
import { connect } from 'react-redux';

class Counter extends Component {

  placeBet = () => {
    this.props.dispatch({type: 'PLACE_BET', payload: {index: 1, amount: 55}});
  };

  playerReadyToRace = () => {
    this.props.dispatch({type: 'PLAYER_READY_TO_RACE'});
  };


  render() {
    return (
        <div>
          <div>{this.props.count}</div>
          <button onClick={this.placeBet}>Place bet</button>
          <button onClick={this.playerReadyToRace}>Ready to race</button>
        </div>
    );
  }
}

const mapStateToProps = state => ({
    count: state.count
});

export default connect(mapStateToProps)(Counter);
