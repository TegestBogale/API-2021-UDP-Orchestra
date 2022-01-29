/*
 This program simulates musician, who plays instruments
 in an orchestra. Auditors can join the group and listen to the music. The
 songs are transported in json payloads with the following format:
   {"timestamp","uuid","sound"}
 Usage: to activate a musician, type the following command in a terminal:
   node musician.js instrument
*/

var protocol = require('./orchestra-protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams
 */
var s = dgram.createSocket('udp4');

/**
 * we add a uuid
 * source utilisée: using CommonJS syntax https://github.com/uuidjs/uuid#readme
 */
const {v4: uuidv4} = require('uuid');

/*
 * Let's define a javascript class for our musician. The constructor accepts
 * an instrument
 */
function musician(instrument) {

    this.instrument = instrument;
    this.uuid = uuidv4();

    /*
       * We will simulate musician changes on a regular basis. That is something that
       * we implement in a class method (via the prototype)
       */
    musician.prototype.update = function () {
        /**
         * mapping the instruments with their sound
         * @type {Map<any, any>}
         */
        var instruments = new Map();
        instruments.set("piano", "ti-ta-ti");
        instruments.set("trumpet", "pouet");
        instruments.set("flute", "trulu");
        instruments.set("violin", "gzi-gzi");
        instruments.set("drum", "boum-boum");
        /*
        * Let's create the playedInstrument as a dynamic javascript object,
              * add the 3 properties (timestamp, uuid and sound)
              * and serialize the object to a JSON string
            */

        var playedInstrument = {
            timestamp: Date.now(),
            uuid: this.uuid,
            sound: Array.from(instruments.get(instrument))
        };
        var payload = JSON.stringify(playedInstrument);

        /*
               * Finally, let's encapsulate the payload in a UDP datagram, which we publish on
               * the multicast address. All subscribers to this address will receive the message.
               */
        message = new Buffer(payload);
        s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function (err, bytes) {
            console.log("Sending payload: " + payload + " via port " + s.address().port);
        });

    }

    /*
         * Let's take and send a music every 1000 ms(=1second)
         */
    setInterval(this.update.bind(this), 1000);

}

/*
 * Let's get the instrument properties from the command line attributes
 * Some error handling wouln't hurt here...
 */
var instrumentChosed = process.argv[2];

/*
 * Let's create a new musician
 */
var instrument = "flute";
var t1 = new musician(instrumentChosed);