const express = require("express"); 
const Router = express.Router();
const mysqlConnection = require("../connect");
const request = require('request');
const uuidAPIKey = require('uuid-apikey');

const Profile = require('../model/Profile');
const User = require('../model/User');

// @route   POST api/error
// @desc    Insert Errror record locally and relay http request to Harbor.  API key passed in through the body and user (email)
// @access  Private
Router.post("/:unit_id/:gps_coord/:sensor_id/:sensor_reading", async (req, res) => {
    console.log('error api')

    const {
        apiKey,
        user
    } = req.body;

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



    try{
        
        mysqlConnection.query(`CALL spINSERT_ERROR('${req.params.unit_id}', '${req.params.gps_coord}', '${req.params.sensor_id}', '${req.params.sensor_reading}')`);
    
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
    res.send('done');
})

// @route   GET /:date_from
// @desc    Get all data from after date perameter
// @access  Public
Router.get("/:date_from", async (req, res) => {
    let data = await mysqlConnection.query(`CALL spGET_ERRORS('${req.params.date_from}')`, true, (error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        res.json(results[0]);
    });
})

// @route   GET /:date_from/:date_to
// @desc    Get all data between date params
// @access  Public
// @date    2020-09-18
Router.get("/:date_from/:date_to", async (req, res) => {
    let data = await mysqlConnection.query(`CALL spGET_ERRORS_Range('${req.params.date_from}', '${req.params.date_to}')`, true, (error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        res.json(results[0]);
    });
})

module.exports = Router;