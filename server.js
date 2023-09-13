const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// io.set('transports',['websocket']);

// Define the socketHandler function
const socketHandler = (socket) => {
    console.log(socket.user, "Connected");
    socket.join(socket.user);
  
    socket.on("makeCall", (data) => {
      let calleeId = data.calleeId;
      let sdpOffer = data.sdpOffer;
  
      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        sdpOffer: sdpOffer,
      });
    });
  
    socket.on("answerCall", (data) => {
      let callerId = data.callerId;
      let sdpAnswer = data.sdpAnswer;
  
      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        sdpAnswer: sdpAnswer,
      });
    });
  
    socket.on("IceCandidate", (data) => {
      let calleeId = data.calleeId;
      let iceCandidate = data.iceCandidate;
  
      socket.to(calleeId).emit("IceCandidate", {
        sender: socket.user,
        iceCandidate: iceCandidate,
      });
    });
  
  socket.on('disconnect', () => {
    console.log('A socket with id ' + socket.user + ' disconnected');
  });

}

// Create a namespace for the /another route
const anotherNamespace = io.of('/videocall');
anotherNamespace.on('connection', socketHandler);

// Define the /another route
app.use('/videocall', (req, res) => {
  res.send('This is video call route');
});

server.listen(4001, () => {
  console.log('Server is running on port 4001');
});
