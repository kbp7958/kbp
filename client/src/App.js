import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import MainScreen from './components/MainScreen';
import SoundControl from './components/SoundControl';

class App extends Component {

    render() {
        if (this.props.account && this.props.contractState) {
            return (
                <div>
                    <SoundControl />
                    <div>Your account is: {this.props.account}</div>
                    <MainScreen />
                </div>
            );
        } else {
            return (
                <div>LOADING</div>
            );
        }
    }
}

const mapStateToProps = state => ({
    account: state.account,
    contractState: state.contractState
});

export default connect(mapStateToProps)(App);
