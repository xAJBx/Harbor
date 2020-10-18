const mongoose = require('mongoose');

//const Instrument = require('./Instrument');

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
    instruments: {
        type: [String]
    }, 
    //end MariaTower.sata   
    uuid: {
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
    settings: {
        uuid: {
            type: String
        },
        cycle_time: { // time is in ms
            type: Number,
            min: 5000,
            default: 300000
        }
    },
    date: {
        type: Date,
        default: Date.now
    }    
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);