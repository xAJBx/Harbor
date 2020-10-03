const express = require('express');
const router = express.Router();
const auth = require('.././middleware/auth');
const { check, validationResult} = require('express-validator');
const uuidAPIKey = require('uuid-apikey');

const Profile = require('../model/Profile');
const User = require('../model/User');
//const Instrument = require('../model/Instrument');

// @route   GET /profile/me
// @decs    Get current logged in user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', [ 'name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /profile
// @decs    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        social,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
        github,
        settings,
        uuid,
        cycle_time
    } = req.body;
    
    

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    
    // Build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;
    if(github) profileFields.social.github = github;
    
    // Build settings object
    profileFields.settings = {};
    if(uuid) profileFields.settings.uuid = uuid;
    if(cycle_time) profileFields.settings.uuid = cycle_time;
    

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        
        // default settings if empty
        if(!profile.settings.cycle_time) profileFields.settings.cycle_time = 300000;

        if(profile){
            // update profile
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, {$set: profileFields}, { new: true });
            return res.json(profile);
        }

        // create profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


// @route   POST /profile/settings/genKey
// @decs    Return API Key and set new uuid in mongo
// @access  Private
router.post('/settings/genKey', auth, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    const uuidFields = {};
    const keyProps = uuidAPIKey.create();
    uuidFields.uuid = keyProps.uuid;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        profile.settings.uuid = uuidFields.uuid;
        await profile.save();
        res.json(keyProps.apiKey);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})

// @route   POST /profile/settings/default
// @decs    Set default user settings
// @access  Private
// @state   Broken
router.post('/settings/defaultxxx', auth, async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const settingsFields = {settings: {
        user: req.user.id,
        cycle_time:  300000
    }};
    //settingsFields.user = req.user.id;
    //settingsFields.settings.cycle_time = 300000;


    try {
        
        let settings = await User.findOne({ user: req.user.id }); 
        settings = new Profile(settingsFields);
        await settings.save();
        
        //const responding = await (Settings.findById(req.settings.id)).select('-uuid');
        res.json(settings);
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});



module.exports = router;