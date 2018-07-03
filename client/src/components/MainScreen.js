import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaceResult from './RaceResult';
import CurrentBets from './CurrentBets';

class MainScreen extends Component {


    render() {

        let component;
        if (this.props.contractState.raceFinished) {
            component = <RaceResult />
        } else {
            component = <CurrentBets />
        }

        return (
            <div>
                {component}
            </div>
        );
        
    }
}

const mapStateToProps = state => ({
    contractState: state.contractState
});

export default connect(mapStateToProps)(MainScreen);
