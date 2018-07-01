import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaceResult from './RaceResult';
import CurrentBets from './CurrentBets';

class MainScreen extends Component {

    render() {
        if (this.props.contractState.raceFinished) {
            return (
                <RaceResult />
            );
        } else {
            return (
                <CurrentBets />
            );
        }
    }
}

const mapStateToProps = state => ({
    contractState: state.contractState
});

export default connect(mapStateToProps)(MainScreen);
