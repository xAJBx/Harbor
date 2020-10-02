const express = require('express');
const router = express.Router();
const auth = require('.././middleware/auth');
const { check, validationResults, validationResult } = require('express-validator');
const uuidAPIKey = require('uuid-apikey');



const Settings = require('../model/Settings');
const User = require('../model/User');
const UserKeyGen = require('../model/UserKeyGen');

// @route   POST /settings/genKey
// @decs    Return API Key and set new uuid in mongo
// @access  Private
router.post('/genKey', auth, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    const uuidFields = {};
    uuidFields.user = req.user.id;
    const keyProps = uuidAPIKey.create();
    uuidFields.uuid = keyProps.uuid;
    try {
        let uuid = await User.findOne({ user: req.user.id });
        uuid = new UserKeyGen(uuidFields);
        await uuid.save();
        res.json(keyProps.apiKey);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})

// @route   POST /settings/default
// @decs    Set default user settings
// @access  Private
router.post('/default', auth, async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const settingsFields = {};
    settingsFields.user = req.user.id;

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

