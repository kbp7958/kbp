import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import io from 'socket.io-client';

let reducer = (state = {count: 0}, {type, payload} ) => {
    switch(type) {
        case 'INCREMENT':
        return {
            count: state.count + 1
        }
        case 'RESET':
        return {
            count: 0
        }
        case 'SET':
        return {
            count: payload.value
        }
        default:
        return state;
    }
}

const socketHandler = (socket) => (store) => (next) => (action) => {
    if(action.type === 'SUBMIT') {
        let state = store.getState();
        socket.emit('action', {value: state.count});
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