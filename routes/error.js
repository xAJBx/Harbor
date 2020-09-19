const express = require("express"); 
const Router = express.Router();
const mysqlConnection = require("../connect");
const request = require('request');

// @route   POST api/error
// @desc    Insert Errror record locally and relay http request to Harbor
// @access  Public
Router.post("/:unit_id/:gps_coord/:sensor_id/:sensor_reading", async (req, res) => {
    console.log('error api')
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
    let data = await mysqlConnection.query(`CALL spGET_ERRORS_Range('${req.params.date_from}, ${req.params.date_to}')`, true, (error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        res.json(results[0]);
    });
})

module.exports = Router;