const express = require("express"); 
const Router = express.Router();
const mysqlConnection = require("../connect");
const request = require('request');
const uuidAPIKey = require('uuid-apikey');
const auth = require('.././middleware/auth');

const Profile = require('../model/Profile');
const User = require('../model/User');

// @route   GET /latestRecord/:view/:unit_id
// @desc    Returns the latest recorded view record
// @access  Private
Router.get('/latestRecord/:owner/:unit_id/:collection_name', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', [ 'name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }

        const owner_id = await User.findOne({ email: req.params.owner })
        const view = `${req.params.collection_name}_${owner_id.id}`

        //console.log(view);
        let table = profile.user.id

        mysqlConnection.query(
            `CALL get_Collection_View_Data('${view}', '${req.params.unit_id}');`,
            function (err, result) {
                if(err) {
                    //console.log(err)
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

        //let table = "Data_" 
        //table += profile.user.id
        // pushed the "Data_" handle upstream to be able to use for collection datas as well
        let table = profile.user.id;

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
