const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    api_key: {
        type: String
    },
    uuid: {
        type: String
    },
    cycle_time: { // time is in ms
        type: Number,
        min: 5000,
        default: 300000
    }
})


module.exports = Settings = mongoose.model('settings', SettingsSchema);