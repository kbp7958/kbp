import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaceResult from './RaceResult';
import CurrentBets from './CurrentBets';
import RaceAnimation from './RaceAnimation';
import '../css/MainScreen.css';

class MainScreen extends Component {

    render() {

        let component;
        if (this.props.contractState.raceFinished) {
            if(this.props.lastEvent !== 'Initialization' && this.props.lastEvent !== 'Race animation ended') {
                component = <RaceAnimation winnerHorse={this.props.contractState.winnerHorse} />
            } else {
                component = <RaceResult />
            }
        } else {
            component = <CurrentBets />
        }

        return (
            <div className="main-screen-container">
                {component}
            </div>
        );
        
    }
}

const mapStateToProps = state => ({
    contractState: state.contractState,
    lastEvent: state.lastEvent
});

export default connect(mapStateToProps)(MainScreen);
