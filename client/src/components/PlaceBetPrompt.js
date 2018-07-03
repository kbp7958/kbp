import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/PlaceBetPrompt.css';
import betSound from '../sounds/bet.mp3';

class PlaceBet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            betAmount: 10,
            selectedHorse: 0
        };

        this.handleBetAmountChange = this.handleBetAmountChange.bind(this);
        this.handleSelectedHorseChange = this.handleSelectedHorseChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleBetAmountChange(event) {
        this.setState({betAmount: event.target.value});
    }

    handleSelectedHorseChange(event) {
        this.setState({selectedHorse: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.dispatch({ type: 'PLACE_BET', payload: { index: this.state.selectedHorse, amount: this.state.betAmount } });

        let audio = new Audio(betSound);
        audio.play();
        audio.muted = !this.props.sounds;
        this.props.dispatch({ type: 'PLAY_SOUND', payload: {sound: audio}});
    }

    render() {
        return (
            <div className="place-bet-container">
                <form className="place-bet-form" onSubmit={this.handleSubmit}>
                    <label>Horse:</label>
                    <select className="horse-to-bet" value={this.state.selectedHorse} onChange={this.handleSelectedHorseChange}>
                        {this.props.contractState.horses.map((horse) => (
                            <option value={horse.index} key={horse.index}>{horse.name}</option>
                        ))}
                    </select>
                    <label>Amount:</label>
                    <input type="number" className="bet-amount-input" value={this.state.betAmount} onChange={this.handleBetAmountChange} />
                    <button type="submit" className="place-bet-button">Place bet</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    contractState: state.contractState,
    sounds: state.sounds
});

export default connect(mapStateToProps)(PlaceBet);
