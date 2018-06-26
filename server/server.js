const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

app.use(express.static(path.resolve(__dirname + '/../client/build')));

server.listen(3001);

let count = 0;

io.on('connection', function (socket) {

  socket.emit('action', {type: 'SET', payload: {value: count}});

  socket.on('action', function (data) {
    count = data.value;
  });
});
