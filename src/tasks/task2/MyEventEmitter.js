const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter {
    constructor() {
        super();
    }
}

const eventEmitter = new MyEventEmitter();

module.exports = {eventEmitter};
