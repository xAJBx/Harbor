const express = require("express"); 
const Router = express.Router();
const mysqlConnection = require("../connect");
const request = require('request');
const uuidAPIKey = require('uuid-apikey');
const auth = require('.././middleware/auth');

const Profile = require('../model/Profile');
const User = require('../model/User');

// @route   GET /latestRecord/:unit_id
// @desc    Returns the latest recorded mysql record
// @access  Private
Router.get('/latestRecord/:unit_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', [ 'name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }

        let table = profile.user.id

        mysqlConnection.query(
            `USE data;
            CALL spGetLatestRecord('${table}', '${req.params.unit_id}');`,
            function (err, result) {
                if(err) {
                    
                    res.json(err);
                }
                else{
                  
                 res.json(result);
                }
            });   
          
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /rangeRecords/:unit_id/:start/:end
// @desc    Returns range of recorded mysql record
// @access  Private
Router.get('/rangeRecords/:unit_id/:start/:end', auth, async (req, res) => {
    try {
        //console.log("request = ", req);
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', [ 'name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }

        let table = "Data_" 
        table += profile.user.id


        mysqlConnection.query(
            `USE data;
            CALL spGET_DATA_Range('${table}', '${req.params.unit_id}','${req.params.start}', '${req.params.end}');`,
            function (err, result) {
                if(err) {
                    console.log(err);
                    res.json(err);
                }
                else{
                  //console.log(result);
                 res.json(result);
                }
            });   
          
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = Router;
