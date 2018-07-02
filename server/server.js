const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const database = require('./database');
const { APPLICATION_PORT } = require('./constants');
const race = require('./race.js');
const fs = require('fs');

const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

app.use(express.static(path.resolve(__dirname + '/../client/build')));

io.on('connection', (socket) => {
    database.querySounds((sounds) => {
        socket.emit('action', { type: 'SET_ACCOUNT', payload: { account: race.getAccount() } });
        socket.emit('action', { type: 'SET_SOUNDS', payload: { sounds } });
        dispatchContratStateUpdate('Initialization');
        socket.on('action', ({ type, payload }) => {
            switch (type) {
                case 'PLACE_BET':
                    race.placeBet(payload.index, payload.amount);
                    break;
                case 'PLAYER_READY_TO_RACE':
                    race.playerReadyToRace();
                    break;
                case 'SET_SOUNDS':
                    database.setSounds(payload.sounds);
                    break;
            }
        });
    });
});

let dispatchContratStateUpdate = (eventLabel) => {
    race.getState().then((contractState) => {
        io.sockets.emit('action', { type: 'CONTRACT_STATE_UPDATE', payload: { eventLabel, contractState } });
    });
};

database.connect();

let eventListener = (eventLabel) => {
    console.log(eventLabel);
    dispatchContratStateUpdate(eventLabel);
};

race.init(settings.provider, eventListener).then(() => {

    console.log('Server started on port ' + APPLICATION_PORT);
    server.listen(APPLICATION_PORT);

});
