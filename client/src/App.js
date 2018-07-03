import React, { Component } from 'react';
import './css/App.css';
import { connect } from 'react-redux';
import MainScreen from './components/MainScreen';
import SoundControl from './components/SoundControl';
import loading from './img/loading.gif';

class App extends Component {

    render() {
        if (this.props.account && this.props.contractState) {
            return (
                <div>
                    <div className="top-bar">
                        <div className="app-title">Racecourse</div>
                        <div className="right-aligned-container">
                            <div className="account">Your account: {this.props.account}</div>
                            <SoundControl />
                        </div>
                    </div>
                    <div className="main-screen-container">
                        <MainScreen />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="loading">
                    <img src={loading} alt="Loading" />
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    account: state.account,
    contractState: state.contractState
});

export default connect(mapStateToProps)(App);
