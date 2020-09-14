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

Router.get("/", async (req, res) => {
    let data = await mysqlConnection.query(`CALL spGET_ERRORS`, true, (error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        res.json(results[0]);
    });
})

module.exports = Router;