/*
 This program simulates auditors, who joins a multicast
 group in order to listen to instruments played by musicians.
 The musicians are transported in json payloads with the following format:
   {"uuid", "instrument", "activeSince"}
 Usage: to start the auditor, use the following command in a terminal
   node auditor.js
*/

/*
 * We have defined the multicast address and port in a file, that can be imported both by
 * auditor.js and musician.js. The address and the port are part of our simple
 * application-level protocol
 */
const protocol = require('./orchestra-protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');

/**
 * We use net module to implement a server with TCP
 * lien utilisé : https://www.yld.io/blog/building-a-tcp-service-using-node-js/
 */
const net = require('net');

/**
 * using "moment" to help us with date manipulations and formatting
 */
const moment = require('moment');
/*
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by musicians and containing songs
 */
const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
    console.log("Joining multicast group");
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

/**
 * List to store the musicians
 */
 var allMusicianList = [];

/**
 *  Returns the active musicians
 */
function activeMusicians(){
    var timeLimit = moment().subtract(5,"seconds");
    var activeMusicianList = [];
    for(var id in allMusicianList){
        var m = allMusicianList[id];
        if(moment(m.lastActivity) >= timeLimit){
            var musicianInfo ={
                "uuid" : id,
                "instrument" : m.instrument,
                "activeSince" : m.instrument
            };
            activeMusicianList.push(musicianInfo);
        }
    }
    return activeMusicianList;
}
/*
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {
    //TODO géré l'arrivé d'un nouveau datagram
    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
});

/**
 * TCP-based server protocol to accept connection requests on port
 * and sends list of active musicians
 */
var server = net.createServer();
server.on("connection",function (socket){
    socket.write(JSON.stringify(activeMusicians()));
    socket.pipe(socket);
    socket.destroy();
});

/**
 * Listening on the givev port
 */
server.listen(protocol.PROTOCOL_PORT,function (){
    console.log("Listening on port: " + protocol.PROTOCOL_PORT);
});