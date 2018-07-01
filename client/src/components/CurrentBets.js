import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentPlayerBet, isCurrentPlayerReadyToRace } from '../race-utils.js';
import PlaceBetPrompt from './PlaceBetPrompt';
import ReadyToRacePrompt from './ReadyToRacePrompt';

class CurrentBets extends Component {

    render() {
        const currentPlayerBet = getCurrentPlayerBet(this.props.account, this.props.contractState.bets);
        let playerAction;
        let message;
        if(!currentPlayerBet) {
            message = 'Place a bet to join the race';
            playerAction = <PlaceBetPrompt />;
        } else if(!isCurrentPlayerReadyToRace(this.props.account, this.props.contractState.bets)) {
            message = 'The race will start when all players are ready'
            playerAction = <ReadyToRacePrompt />;
        }
        return (
            <div>
                <div>CURRENT BETS</div>
                <div>Jackpot: {this.props.contractState.jackpot}</div>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Horse</th>
                            <th>Bet</th>
                            <th>Ready to race</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.contractState.bets.map((bet) => (
                            <tr key="{bet.player}">
                                <td>{bet.player}</td>
                                <td>{this.props.contractState.horses[bet.index].name}</td>
                                <td>{bet.amount}</td>
                                <td>{bet.readyToRace? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {message}
                {playerAction}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account,
    contractState: state.contractState
});

export default connect(mapStateToProps)(CurrentBets);
