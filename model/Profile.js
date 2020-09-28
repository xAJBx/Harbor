const mongoose = require('mongoose');

const Instrument = require('./Instrument');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    bio: {
        type: String
    },
    //MariaTower.data.Data
    instruments: [{
        
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
    }],
    //end MariaTower.sata   
    api_key: {
        type: String
    },
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        },
        github: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }    
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);