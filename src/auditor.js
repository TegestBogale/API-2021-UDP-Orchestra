/*
 This program simulates auditors, who joins a multicast
 group in order to listen to instruments played by musicians.
 The musicians are transported in json payloads with the following format:
   {""}
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

/*
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by musicians and containing songs
 */
const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
    console.log("Joining multicast group");
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

/*
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
});