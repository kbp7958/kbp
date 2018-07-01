import React, { Component } from 'react';
import { connect } from 'react-redux';

class ReadyToRacePrompt extends Component {

    playerReadyToRace = () => {
        this.props.dispatch({ type: 'PLAYER_READY_TO_RACE' });
    };


    render() {

        return (
            <div>
                <button onClick={this.playerReadyToRace}>Ready to race</button>
            </div>
        );
    }
}

export default connect()(ReadyToRacePrompt);
