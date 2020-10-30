const express = require("express"); 
const Router = express.Router();
const mysqlConnection = require("../../connect");
const request = require('request');
const uuidAPIKey = require('uuid-apikey');

const Profile = require('../../model/Profile');
const User = require('../../model/User');

// @route   POST api/error
// @desc    Insert Errror record locally and relay http request to Harbor.  API key passed in through the body and user (email)
// @access  Private
Router.post("/:unit_id/:gps_coord/:sensor_id/:sensor_reading", async (req, res) => {
    console.log('error api');
    console.log(req.body);
    try{
    const {
        apiKey,
        user
    } = req.body;
    console.log(req.body);
    if(!uuidAPIKey.isAPIKey(apiKey)) res.json({ msg: "Not a valid API key"});

    // find user
    const userFind = await User.findOne({ email: user });

    // find profile
    const profile = await Profile.findOne({ user: userFind.id});
    
    if(!userFind) res.json({ msg: "User not found"});
    if(!profile) res.json({ msg: "User does not have a profile"});
    
    // check key against uuid
    if(!uuidAPIKey.check(apiKey, profile.settings.uuid)){
        res.json({ msg: "Invalid API Key or User"})
    };



    
        
        mysqlConnection.query(`CALL spINSERT_ERROR('${req.params.unit_id}', '${req.params.gps_coord}', '${req.params.sensor_id}', '${req.params.sensor_reading}')`);
    
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
    //res.send('done');
})

module.exports = Router;
