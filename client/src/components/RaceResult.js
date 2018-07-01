import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlaceBetPrompt from './PlaceBetPrompt';
import { getWinners } from '../race-utils';
import RaceAnimation from './RaceAnimation';

class RaceResult extends Component {

    render() {

        let winners = getWinners(this.props.contractState.winnerHorse, this.props.contractState.bets);
        let award;
        let message;
        if(winners.length > 0) {
            award = this.props.contractState.jackpot / winners.length;
            if(winners.indexOf(this.props.contractState.account)) {
                message = <div>Congratulations! you won {award}!</div>;
            }
        } else {
            message = <div>No winners, jackpot grows to: {this.props.contractState.jackpot}</div>;
        }

        return (
            <div>

                {this.props.lastEvent === 'Finished race' && (
                    <RaceAnimation winnerHorse={this.props.contractState.winnerHorse} />
                )}
                
                <div>RACE RESULTS</div>
                <div>Winner horse: {this.props.contractState.horses[this.props.contractState.winnerHorse].name}</div>
                <div>Jackpot: {this.props.contractState.jackpot}</div>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Horse</th>
                            <th>Bet</th>
                            <th>Award</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.contractState.bets.map((bet) => (
                            <tr key="{bet.player}">
                                <td>{bet.player}</td>
                                <td>{this.props.contractState.horses[bet.index].name}</td>
                                <td>{bet.amount}</td>
                                <td>{winners.indexOf(bet.player) !== -1 ? award : 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {message}
                <div>Place a new bet to start another race</div>
                <PlaceBetPrompt />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    contractState: state.contractState,
    lastEvent: state.lastEvent
});

export default connect(mapStateToProps)(RaceResult);
