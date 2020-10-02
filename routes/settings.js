const express = require('express');
const router = express.Router();
const auth = require('.././middleware/auth');
const { check, validationResults, validationResult } = require('express-validator');
const uuidAPIKey = require('uuid-apikey');



const Settings = require('../model/Settings');
const User = require('../model/User');

// @route   POST /settings/default
// @decs    Generate API key and set default user settings
// @access  Private
router.post('/default', auth, async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const settingsFields = {};
    settingsFields.user = req.user.id;
    const keyObject = uuidAPIKey.create();


    settingsFields.uuid = keyObject.uuid;
    settingsFields.api_key = keyObject.apiKey;

    console.log(settingsFields);



    try {
        
        let settings = await User.findOne({ user: req.user.id }); 
        settings = new Settings(settingsFields);
        await settings.save();
        
        //const responding = await (Settings.findById(req.settings.id)).select('-uuid');
        res.json(settings);
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});



module.exports = router;

