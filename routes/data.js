const express = require("express"); 
const Router = express.Router();
const mysqlConnection = require("../connect");
const request = require('request');

// @route   POST api/data
// @desc    Insert Sensor data to local db & relays post request to datacenter
// @access  Public
Router.post("/:Coordinates/:Sensor0/:Sensor1/:Sensor2/:Sensor3/:ErrorCode", (req, res) => {
    mysqlConnection.query(`INSERT INTO sensor_data (Coordinates, Sensor0_data, Sensor1_data, Sensor2_data, Sensor3_data, ErrorCode) 
    VALUES ('${req.params.Coordinates}' , '${req.params.Sensor0}', '${req.params.Sensor1}', '${req.params.Sensor2}', '${req.params.Sensor3}', '${req.params.ErrorCode}')`);  
    res.send(x);
})

module.exports = Router;