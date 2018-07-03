import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import io from 'socket.io-client';

let reducer = (state = {}, {type, payload} ) => {
    switch(type) {
        case 'SET_ACCOUNT':
            return Object.assign({}, state, {
                account: payload.account,
                lastEvent: payload.eventLabel
            });
        case 'SET_SOUNDS':
            return Object.assign({}, state, {
                sounds: payload.sounds
            });
        case 'CONTRACT_STATE_UPDATE':
            return Object.assign({}, state, {
                contractState: payload.contractState,
                lastEvent: payload.eventLabel
            });
        default: return state;
    }
}

const socketHandler = (socket) => (store) => (next) => (action) => {
    switch(action.type) {
        case 'PLACE_BET':
        case 'PLAYER_READY_TO_RACE':
        case 'SET_SOUNDS':
        socket.emit('action', action); break;
        default: break;
    }
    next(action);
};

const socket = io.connect('/');

const middleWare = applyMiddleware(socketHandler(socket));

const store = createStore(reducer, middleWare);

socket.on('action', (data) => {
    store.dispatch(data);
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();