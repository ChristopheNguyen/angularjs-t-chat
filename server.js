
var express = require('express');
var app = express();

var http = require('http');
var server = http.createServer(app);

var io = require('socket.io').listen(server);

var port = 3000;

server.listen(port, function(error) {
    if (error) {
        console.error(error)
    } else {
        console.info(
            "Listening on port %s. Open up http://localhost:%s/ in your browser.",
            port, port
        )
    }
});


app.use(express.static(__dirname  + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat', function(err){
    if(err) throw err;
    else console.log("Connected to mongodb://localhost/chat");
});

var messageSchema = mongoose.Schema({
    username: String,
    message: String,
    created: {
        type: Date, default: Date.now
    }
});

var MessageModel = mongoose.model('Message', messageSchema);


var usersList = [];

io.on('connection',function(socket){
    socket.on('get old msg', function () {
        var query = MessageModel.find().sort({'created': -1});

        query.exec( function(err, data){
            if(err) throw err;

            var datas = [];
            for (var i = data.length-1; i >= 0; i--) {
                var binDatas = {
                    username: data[i].username,
                    message: data[i].message,
                    created: data[i].created
                };
                datas.push(binDatas);
            }
            // sending to sender-client only
            socket.emit('set old msg', datas);
        });
    });

    socket.on('send msg', function(data){
        var newMessage = new MessageModel({
            username: data.username,
            message: data.message
        });

        newMessage.save(function (err) {
            if (err) throw err;
        });

        var datas = {
            username: data.username,
            message: data.message
        };

        // sending to all clients, include sender
        io.sockets.emit('get msg', datas);
    });

    socket.on('set new user', function(data) {
        if (data in usersList){
            socket.emit('duplicate');
        } else {
            usersList.push(data);

            // sending to all clients, include sender
            io.sockets.emit('get users list',usersList);
        }
    });
});
