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
        
        mysqlConnection.query(`CALL spINSERT_ERROR('${req.params.unit_id}', '${req.params.gps_coord}', '${req.params.sensor_id}', '${req.params.sesnsor_reading}')`);
    
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
    res.send('done');
})//

module.exports = Router;