const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const database = require('./database');
const { APPLICATION_PORT} = require('./constants');

app.use(express.static(path.resolve(__dirname + '/../client/build')));

io.on('connection', function (socket) {

  database.queryCounter((value) => {
    socket.emit('action', {type: 'SET', payload: {value: value}});
  });

  socket.on('action', function (data) {
    database.setCounter(data.value);
  });

});

database.connect();

console.log('Server started on port ' + APPLICATION_PORT);
server.listen(APPLICATION_PORT);
