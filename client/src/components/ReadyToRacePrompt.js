import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/ReadyToRacePrompt.css';

class ReadyToRacePrompt extends Component {

    playerReadyToRace = () => {
        this.props.dispatch({ type: 'PLAYER_READY_TO_RACE' });
    };


    render() {

        return (
            <div className="ready-to-race-prompt-container">
                <div className="ready-to-race-controls">
                    <div className="ready-to-race-message">Are you ready to race?</div>
                    <button className="ready-to-race-button" onClick={this.playerReadyToRace}>Yes, I'm ready</button>
                </div>
            </div>
        );
    }
}

export default connect()(ReadyToRacePrompt);
