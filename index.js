var express=require('express');
var app = express();
var fs = require('fs');

var http = require('http');
var expressServer = http.createServer(app)

var {Server} = require('socket.io')
var io = new Server(expressServer)

var path = require('path');

app.use(express.static('./front-end/build'));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front-end','build','index.html'))
})

var userList = []

io.on('connection',(socket)=>{
    console.log("connected")

    socket.on('addNewUser',(user)=>{
        userList.push(user)
        io.emit('announceNewUser',user)
        io.emit('userList',userList)
        socket.peerId = user.peerId;

        console.log(socket)
        console.log(userList)
        console.log("here")
    })

    socket.on('disconnect',()=>{
        userList.map(
            (p1,p2)=>
            {
                if(p1.peerId===socket.peerId)
                {
                    userList.splice(p2,1)
                    io.emit('announceLeftUser',p1)
                    io.emit('userList',userList)
                }
            }
        )
    })

    
})





expressServer.listen(5000)