const mongoose = require('mongoose');


const InstrumentSchema = new mongoose.Schema({

    time_stamp: {
        type: Date
    },
    record_id: {
        type: Number
    },
    unit_id: {
        type: String
    },
    gps_coord: {
        type: String
    },
    sensor_id: {
        type: String
    },
    sensor_reading: {
        type: Number
    } 
});

module.exports = Instrument = mongoose.model('instrument', InstrumentSchema);