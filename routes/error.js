const express = require("express"); 
const Router = express.Router();
const mysqlConnection = require("../connect");
const request = require('request');
const uuidAPIKey = require('uuid-apikey');

const Profile = require('../model/Profile');
const User = require('../model/User');


// @route   GET /:date_from
// @desc    Get all data from after date perameter
// @access  Public
Router.get("/:date_from", async (req, res) => {
    mysqlConnection.query(`CALL spGET_ERRORS('${req.params.date_from}')`, true, (error, results, fields) => {
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