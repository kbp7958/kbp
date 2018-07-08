const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const database = require('./database');
const { APPLICATION_PORT } = require('./constants');
const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  });
const sharedsession = require("express-socket.io-session");
const Racecourse = require('./Racecourse');

app.use(session);

io.use(sharedsession(session));

app.use(express.static(path.resolve(__dirname + '/../client/build')));

io.on('connection', (socket) => {

    database.querySounds((sounds) => {

        socket.emit('action', { type: 'SET_SOUNDS', payload: { sounds } });

        let eventListener = (eventLabel) => {
            console.log('Event: ' + eventLabel + ' (client ' + socket.id + ')');
            dispatchContratStateUpdate(socket, 'Contract status changed');
        };

        socket.emit('action', { type: 'SET_SOUNDS', payload: { sounds } });
        dispatchSessionInformation(socket);
        
        socket.on('action', ({ type, payload }) => {
            switch (type) {
                case 'LOGIN':
                    handleLogin(socket, payload.url, payload.user, payload.password, eventListener);
                    break;
                case 'LOGOUT':
                    handleLogout(socket);
                    break;
                case 'PLACE_BET':
                    socket.handshake.session.racecourse.placeBet(payload.index, payload.amount, payload.account);
                    break;
                case 'PLAYER_READY_TO_RACE':
                    socket.handshake.session.racecourse.playerReadyToRace(payload.account);
                    break;
                case 'SET_SOUNDS':
                    database.setSounds(payload.sounds);
                    break;
            }
        });
    });
});

let handleLogin = (socket, url, user, password, eventListener) => {
    console.log('Attempting to connect to ' + url + ' with user "' + (user || '') + '" (client ' + socket.id + ')');
    let racecourse;
    try {
        racecourse = new Racecourse(url, user, password, eventListener);
    } catch(error) {
        console.log(error)
    }

    if(racecourse) {
        socket.handshake.session.racecourse = racecourse;
        socket.handshake.session.data = {
            loginFailed: false,
            accounts: racecourse.accounts,
            url: url,
            user: user
        };
        socket.handshake.session.save();
        dispatchContratStateUpdate(socket, 'Initialization');
    } else {
        socket.handshake.session.data = {
            loginFailed: true
        };
        socket.handshake.session.save();
    }
    dispatchSessionInformation(socket);
};

let handleLogout = (socket) => {
    console.log('Disconnected from ' + socket.handshake.session.data.url + ' with user "' + (socket.handshake.session.data.user || '') + '" (client ' + socket.id + ')');
    socket.handshake.session.racecourse.stopWatching();
    delete socket.handshake.session.racecourse;
    delete socket.handshake.session.data;
    socket.handshake.session.save();
    dispatchSessionInformation(socket);
};

let dispatchSessionInformation = (socket) => {
    socket.emit('action', { type: 'SESSION_STATUS_UPDATE', payload: {
        sessionData: socket.handshake.session.data || {}
    }});
};

let dispatchContratStateUpdate = (socket, eventDescription) => {
    socket.handshake.session.racecourse.getState().then((contractState) => {
        socket.emit('action', { type: 'CONTRACT_STATE_UPDATE', payload: { contractState, eventDescription } });
    });
};

database.connect((() => {
    console.log('Server started on port ' + APPLICATION_PORT);
    server.listen(APPLICATION_PORT);
}));

