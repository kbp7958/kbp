const Web3 = require('web3');
const contract = require('truffle-contract');
const assert = require('assert');
const fs = require('fs');

class Racecourse {

    constructor(url, user, password, eventListener) {
        let web3 = new Web3(new Web3.providers.HttpProvider(url, 0, user, password));
        if(web3.isConnected()) {
            let raceContract = contract(JSON.parse(fs.readFileSync('../blockchain/build/contracts/Race.json', 'utf8')));
            raceContract.setProvider(web3.currentProvider);
            this.raceContract = raceContract;
            this.accounts = web3.eth.accounts
            web3.eth.getBlockNumber((err, blockNumber) => {
                this.listenForEvents(eventListener, blockNumber).then((events) => {
                    this.events = events;
                }).catch(() => {
                    throw 'Estblished connection, but could not access contract';
                });
            });
        } else {
            throw 'Connection failed'
        }
    };

    listenForEvents(eventListener, skipBlock) {
        return new Promise((resolve, reject) => {
            this.raceContract.deployed().then(function (instance) {
                let betPlacedEvent = instance.betPlaced({}, { fromBlock: 'latest', toBlock: 'latest' });
                betPlacedEvent.watch((err, result) => {
                    assert.equal(null, err);
                    if(result.blockNumber != skipBlock) {
                        eventListener('Bet placed');
                    }
                });
                let playersReadyToRaceEvent = instance.playersReadyToRaceChanged({}, { fromBlock: 'latest', toBlock: 'latest' });
                playersReadyToRaceEvent.watch((err, result) => {
                    assert.equal(null, err);
                    if(result.blockNumber != skipBlock) {
                        eventListener('Players ready to race changed');
                    }
                });
                let raceFinishedEvent = instance.finishedRace({}, { fromBlock: 'latest', toBlock: 'latest' });
                raceFinishedEvent.watch((err, result) => {
                    assert.equal(null, err);
                    if(result.blockNumber != skipBlock) {
                        eventListener('Finished race');
                    }
                });
                resolve([betPlacedEvent, playersReadyToRaceEvent, raceFinishedEvent]);
            }).catch(function (error) {
                console.log(error)
                reject()
            });
        });
    };

    stopWatching() {
        for(let event of this.events) {
            event.stopWatching();
        }
    }

    getState() {
        let raceInstance;
        let contractState = {};
        return this.raceContract.deployed().then(function (instance) {
            raceInstance = instance;
            return raceInstance.horseCount();
        }).then(function (horseCount) {
            let horsePromises = [];
            for (var i = 0; i < horseCount; i++) {
                horsePromises.push(raceInstance.horses(i));
            }
            return Promise.all(horsePromises).then((horses) => {
                contractState.horses = [];
                for (var i = 0; i < horseCount; i++) {
                    contractState.horses.push({
                        index: horses[i][0].toString(),
                        name: horses[i][1]
                    });
                }
                return raceInstance.betCount();
            });
        }).then(function (betCount) {
            let betPromises = [];
            for (var i = 0; i < betCount; i++) {
                betPromises.push(raceInstance.bets(i));
            }
            return Promise.all(betPromises).then((bets) => {
                contractState.bets = [];
                for (var i = 0; i < betCount; i++) {
                    contractState.bets.push({
                        index: bets[i][0].toString(),
                        player: bets[i][1],
                        amount: bets[i][2].toString(),
                        playerReadyToRace: bets[i][3]
                    });
                }
                return raceInstance.playersReadyToRace();
            });
        }).then(function (playersReadyToRace) {
            contractState.playersReadyToRace = playersReadyToRace.toString();
            return raceInstance.raceFinished();
        }).then(function (raceFinished) {
            contractState.raceFinished = raceFinished;
            return raceInstance.jackpot();
        }).then(function (jackpot) {
            contractState.jackpot = jackpot.toString();
            return raceInstance.winnerHorse();
        }).then(function (winnerHorse) {
            contractState.winnerHorse = winnerHorse.toString();
            return contractState;
        }).catch(function (error) {
            console.log(error);
        });
    };

    placeBet(index, amount, account) {
        return this.raceContract.deployed().then(function (instance) {
            return instance.placeBet(index, amount, {from: account, gas: 45000000});
        }).catch(function (error) {
            console.log(error)
        });
    }
    
    playerReadyToRace(account) {
        return this.raceContract.deployed().then(function (instance) {
            return instance.playerReadyToRace({from: account, gas: 45000000});
        }).catch(function (error) {
            console.log(error)
        });
    }

}

module.exports = Racecourse;