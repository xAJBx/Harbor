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
    
        collections: [{
            collection_name: {
                type: String
            },
	    // <2021_02_20>
            collection_instruments: [{
		instrument_name: { type: String },
		instrument_portion: { type: Number, default: 0 },
		instrument_unit: { type: String, default: 'unit'}
            }],
	    // <\2021_02_20>
            collection_people: {
                type: [String]
            },
            collection_owner: {
                type: String
            },
	    //<2021_02_13>
	    collection_comments: [{
		comment: { type:  String },
		author: { type: String },
		post_time: { type : Date, default: Date.now }
	    }]
	    //<\2021_02_13>
        }],
    
    date: {
        type: Date,
        default: Date.now
    }    
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
