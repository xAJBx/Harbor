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
            `CALL spGetLatestRecord('${table}', '${req.params.unit_id}')`,
            function (err, result) {
                if(err) {
                    
                    res.json(err)
                }
                else{
                  
                 res.json(result)
                }
            });   
          
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = Router;