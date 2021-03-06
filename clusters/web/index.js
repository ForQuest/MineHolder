const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

const customLogger = require('utils/logger')
const loadSocketIO = require('./lib/socketio')

function serverStart(){
  app.use(express.static(path.join(__base, 'public')));
  loadSocketIO(io)
  server.listen(port, () => { 
    logger.debug(logSystem, 'serverStart', `Server listening at port ${port}`)
  });
  
  process.on('message', function(message) {
    const { type, data } = message;
    switch(type){
      case 'messageSended':
        const { line } = data;
        io.sockets.emit('mc_message', line);
        break
      default:
        break
    }
  })
}

module.exports = function(){
  global.logSystem = 'WEB'
  global.config = JSON.parse(process.env.config)
  global.logger = new customLogger(config.logger)

  serverStart()
}

