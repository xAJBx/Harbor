const express = require('express');
const router = express.Router();
const auth = require('.././middleware/auth');
const { check, validationResult} = require('express-validator');

const Profile = require('../model/Profile');
const User = require('../model/User');

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
        instruments,
        api_key,
        social,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
        github
    } = req.body;
    
    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(instruments){
        profileFields.instruments = instruments.split(',').map(instruments => instruments.trim());
    };
    if(api_key) profileFields.api_key = api_key;

    // Build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;
    if(github) profileFields.social.github = github;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
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

module.exports = router;