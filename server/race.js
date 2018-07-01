const Web3 = require('web3');
const contract = require('truffle-contract');
const assert = require('assert');
const fs = require('fs');

let account;
let Race;

let init = (provider, eventListener) => {
    return new Promise((resolve, reject) => {
        let web3 = new Web3(new Web3.providers.HttpProvider(provider.url, 0, provider.username, provider.apikey));
        web3.eth.getCoinbase((err, coinBase) => {
            assert.equal(null, err);
            account = coinBase;
            Race = contract(JSON.parse(fs.readFileSync('../blockchain/build/contracts/Race.json', 'utf8')));
            Race.setProvider(web3.currentProvider);
            listenForEvents(eventListener).then(() => {
                resolve();
            });
        });
    });
};

let listenForEvents = (eventListener) => {
    return Race.deployed().then(function (instance) {
        instance.betPlaced({}, { fromBlock: 'latest', toBlock: 'latest' }).watch((err) => {
            assert.equal(null, err);
            eventListener();
        });
        instance.playersReadyToRaceChanged({}, { fromBlock: 'latest', toBlock: 'latest' }).watch((err) => {
            assert.equal(null, err);
            eventListener();
        });
        instance.finishedRace({}, { fromBlock: 'latest', toBlock: 'latest' }).watch((err) => {
            assert.equal(null, err);
            eventListener();
        });
    }).catch(function (error) {
        console.log(error)
    });
};

let getState = () => {
    let raceInstance;
    let contractState = {};
    return Race.deployed().then(function (instance) {
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
                    planer: bets[i][1],
                    amount: bets[i][2].toString()
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

let placeBet = (index, amount) => {
    return Race.deployed().then(function (instance) {
        return instance.placeBet(index, amount, {from: account, gas: 45000000});
    }).then(function () {
        console.log('Bet placed')
    }).catch(function (error) {
        console.log(error)
    });
}

let playerReadyToRace = (index, amount) => {
    return Race.deployed().then(function (instance) {
        return instance.playerReadyToRace(index, amount, {from: account, gas: 45000000});
    }).then(function () {
        console.log('Player ready to race')
    }).catch(function (error) {
        console.log(error)
    });
}

let getAccount = () => {
    return account;
};

module.exports = {
    init,
    getState,
    placeBet,
    getAccount,
    playerReadyToRace
};
