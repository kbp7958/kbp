import React, { Component } from 'react';
import { connect } from 'react-redux';

class PlaceBet extends Component {

    placeBet = () => {
        this.props.dispatch({ type: 'PLACE_BET', payload: { index: 1, amount: 55 } });
    };

    render() {

        return (
            <div>
                <button onClick={this.placeBet}>Place bet</button>
            </div>
        );
    }
}

export default connect()(PlaceBet);
