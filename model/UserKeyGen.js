const mongoose = require('mongoose');


const UserKeyGenSchema = new mongoose.Schema({
    uuid: {
        type: String
    }
})


module.exports = UserKeyGen = mongoose.model('userkeygen', UserKeyGenSchema);