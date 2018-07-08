const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const database = require('./database');
const { APPLICATION_PORT } = require('./constants');
const race = require('./race.js');
const fs = require('fs');
const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  });
const sharedsession = require("express-socket.io-session");
 
app.use(session);

io.use(sharedsession(session));

const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

app.use(express.static(path.resolve(__dirname + '/../client/build')));

io.on('connection', (socket) => {

    database.querySounds((sounds) => {

        let eventListener = (eventLabel) => {
            console.log('Event: ' + eventLabel);
            dispatchContratStateUpdate(socket, 'Contract status changed');
        };

        //TODO: TEMPORARY START!
        handleLogin(socket, 'HTTP://127.0.0.1:7545', null, null, eventListener);
        //TODO: TEMPORARY END!
        
        socket.emit('action', { type: 'SET_SOUNDS', payload: { sounds } });
        dispatchSessionInformation(socket);
        

        socket.on('action', ({ type, payload }) => {
            switch (type) {
                case 'LOGIN':
                    handleLogin(socket, payload.url, payload.user, payload.password, eventListener, events);
                    break;
                case 'LOGOUT':
                    handleLogout(socket);
                    break;
                case 'PLACE_BET':
                race.stopListening(socket.handshake.session.raceContract);
                    race.placeBet(socket.handshake.session.raceContract, payload.index, payload.amount, payload.account);
                    break;
                case 'PLAYER_READY_TO_RACE':
                    race.playerReadyToRace(socket.handshake.session.raceContract, payload.account);
                    break;
                case 'SET_SOUNDS':
                    database.setSounds(payload.sounds);
                    break;
            }
        });
    });
});

let handleLogin = (socket, url, user, password, eventListener) => {
    race.connect(url, user, password, eventListener).then(({raceContract, accounts, events}) => {
        socket.handshake.session.raceContract = raceContract;
        socket.handshake.session.events = events;
        socket.handshake.session.data = {
            loginFailed: false,
            accounts,
            url: url,
            user: user
        };
        socket.handshake.session.save();
        dispatchContratStateUpdate(socket, 'Initialization');
    }).catch(() => {
        // delete socket.handshake.session.raceContract;
        // delete socket.handshake.session.data;
        socket.handshake.session.save();
        socket.handshake.session.data = {
            loginFailed: true
        };
    }).then(() => {
        dispatchSessionInformation(socket);
    });
};

let handleLogout = (socket) => {
    console.log('Disconnected from ' + socket.handshake.session.data.url + ' with user "' + (socket.handshake.session.data.user || '') + '"');
    // race.stopListening(socket.handshake.session.raceContract);

    console.log(socket.handshake.session.events)
    // delete socket.handshake.session.raceContract;
    // delete socket.handshake.session.data;
    socket.handshake.session.save();
    dispatchSessionInformation(socket);
};

let dispatchSessionInformation = (socket) => {
    socket.emit('action', { type: 'SESSION_STATUS_UPDATE', payload: {
        sessionData: socket.handshake.session.data || {}
    }});
};

let dispatchContratStateUpdate = (socket, eventDescription) => {
    race.getState(socket.handshake.session.raceContract).then((contractState) => {
        socket.emit('action', { type: 'CONTRACT_STATE_UPDATE', payload: { contractState, eventDescription } });
    });
};

database.connect((() => {
    console.log('Server started on port ' + APPLICATION_PORT);
    server.listen(APPLICATION_PORT);
}));

