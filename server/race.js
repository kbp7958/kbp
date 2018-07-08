const Web3 = require('web3');
const contract = require('truffle-contract');
const assert = require('assert');
const fs = require('fs');

let connect = (url, user, password, eventListener) => {
    console.log('Attempting to connect to ' + url + ' with user "' + (user || '') + '"');
    return new Promise((resolve, reject) => {
        let web3 = new Web3(new Web3.providers.HttpProvider(url, 0, user, password));
        if(web3.isConnected()) {
            let raceContract = contract(JSON.parse(fs.readFileSync('../blockchain/build/contracts/Race.json', 'utf8')));
            raceContract.setProvider(web3.currentProvider);
            web3.eth.getBlockNumber((err, blockNumber) => {
                listenForEvents(raceContract, eventListener, blockNumber).then((events) => {
                    console.log('Connection successful');
                    resolve({raceContract, accounts: web3.eth.accounts, events});
                }).catch(() => {
                    console.log('Estblished connection, but could not access contract');
                    reject();
                });
            });
        } else {
            console.log('Connection failed');
            reject();
        }
    });
};

let listenForEvents = (raceConnection, eventListener, skipBlock) => {
    return new Promise((resolve, reject) => {
        raceConnection.deployed().then(function (instance) {
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
            reject(error)
        });
    });
};

let stopListening = (raceConnection) => {
    return new Promise((resolve, reject) => {
        raceConnection.deployed().then(function (instance) {
            // instance.allEvents().stopWatching();
            // console.log(instance.allEvents())
            // console.log('Stop listeners')
            // instance.betPlaced({}, { fromBlock: 'latest', toBlock: 'latest' }).stopWatching((err, details) => {
            //     console.log(err)
            //     console.log(details)
            // });
            // instance.playersReadyToRaceChanged({}, { fromBlock: 'latest', toBlock: 'latest' }).stopWatching();
            // instance.finishedRace({}, { fromBlock: 'latest', toBlock: 'latest' }).stopWatching();
            resolve();
        }).catch(function (error) {
            // console.log("AAAAAAAAAAAAAAAAA")
            reject(error)
        });
    });
};

let getState = (raceContract) => {
    let raceInstance;
    let contractState = {};
    return raceContract.deployed().then(function (instance) {
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

let placeBet = (raceContract, index, amount, account) => {
    return raceContract.deployed().then(function (instance) {
        return instance.placeBet(index, amount, {from: account, gas: 45000000});
    }).catch(function (error) {
        console.log(error)
    });
}

let playerReadyToRace = (raceContract, account) => {
    return raceContract.deployed().then(function (instance) {
        return instance.playerReadyToRace({from: account, gas: 45000000});
    }).catch(function (error) {
        console.log(error)
    });
}

module.exports = {
    connect,
    stopListening,
    getState,
    placeBet,
    playerReadyToRace
};
