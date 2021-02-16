const express = require('express');
const router = express.Router();
const auth = require('.././middleware/auth');
const { body, check, validationResult} = require('express-validator');
const uuidAPIKey = require('uuid-apikey');
const mysqlConnection = require("../connect");

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
        cycle_time,
        collections
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
    if(uuid) {
        profileFields.settings.uuid = uuid
    }else{
        try{
            let tempo = await Profile.findOne({ user: req.user.id})
            profileFields.settings.uuid = tempo.settings.uuid 
        }catch(err){
            res.send(err);
        }
    };
    if(cycle_time) profileFields.settings.cycle_time = cycle_time;

    // Build collections
    if(collections) profileFields.collections = collections;

    // default settings
    if(!profileFields.settings.cycle_time) profileFields.settings.cycle_time = 300000;

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




// @route   POST /profile/comment/:collection
// @decs    Post a comment on a collection
// @access  Private

router.post('/comment/:collection_name', [
    body("collection_comment", "comment can not be null").not().isEmpty(),
    body("collection_users", "a list of users must be included").not().isEmpty()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
	return res.status(400).json({ errors: errors.array()});
    }
    const collection = req.params.collection_name;
    const {collection_comment, collection_users} = req.body;
    try{
	let collection_users_array = collection_users.split(",")
	//console.log(collection_users_array);
	for(let i = collection_users_array.length; i > 0; i--){
	    profile = await Profile.findOne({email: collection_users_array[i]});
	    //console.log(profile);
	    console.log(collection);
	    console.log('======================');
	    console.log(profile.collections);
	    for(let j = profile.collections.length; j > 0; j--){
		console.log('here');
	        if(profile.collections[j].collection_name === collection){
		    console.log(collection_comment);
		    profile.collections[j].collection_comments += profile.collections[j].collection_comments.unshift(collection_comment);
		    await profile.save();
	        }
	    }
	    //profile.collections.collection_comments.unshift(collection_comment);
	    //await profile.save();
	    //console.log(profile);
	}
	res.json({msg:'done comment'});
    }catch (err){
	console.log('error in this bia');
	console.log({msg: err});
	res.json({msg: toString(err)});
    }
})

// @route   POST /profile/createCollection
// @decs    Create or Replace a collection
// @toDo    1. validate users exist and handle otherwise
//          2. implement coments amungst the users
//          3. validate instruments exist
// @access  Private
router.post('/createCollection', [
    body("collection_owner", "must have owner").not().isEmpty(),
    body("collection_users", "must have users").not().isEmpty(),
    body("collection_name", "must have owner").not().isEmpty(),
    body("collection_instruments", "must have owner").not().isEmpty()
],auth, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    const {
        collection_owner,
        collection_name,
        collection_instruments,
        collection_users
    } = req.body;

    try{
        let user = await User.findOne({ email: collection_owner});
        let user_id = await user.id;

        console.log(user); 

        // add collection to owner mongoDB
        let owner_profile = await Profile.findOne({ user: user_id });
        let owner_collections = owner_profile.collections;
        let collection_add_obj = {
            "collection_name": collection_name,
            "collection_people": collection_users.split(","),
            "collection_instruments": collection_instruments.split(",")
        }
        owner_collections.collections = owner_collections.push(collection_add_obj)
        if(owner_profile){
            // update profile
            profile = await Profile.findOneAndUpdate({ user: user_id }, {$set: owner_profile}, { new: true });
            //return res.json(profile);
        }
       

        // add collection to outside users collections
        // loop this for number of users to share with
        for(let user_loop_index = 0; user_loop_index < collection_users.split(",").length; user_loop_index++){
        let share_user = await User.findOne({ email: collection_users.split(",")[user_loop_index]});
        let share_user_id = await share_user.id;


        // add collection to users mongoDB
        let share_user_profile = await Profile.findOne({ user: share_user_id });
        if(!share_user_profile.collections){
            share_user_profile.collections = [];
            await share_user_profile.save();
        }
        let share_collections = share_user_profile.collections;
            let collection_add_share_user_obj = {		
            "collection_name": collection_name,
            "collection_people": collection_users.split(","),
            "collection_instruments": collection_instruments.split(","),
            "collection_owner": collection_owner
        }
        share_collections.collections = share_collections.push(collection_add_share_user_obj)
        if(share_user_profile){
            // update profile
            profile = await Profile.findOneAndUpdate({ user: share_user_id }, {$set: share_user_profile}, { new: true });
            //return res.json(profile);
        }
    }

        //================





        // prepare instrument list for sql view sp
        let collection_instruments_quoted = collection_instruments.replace(/,/g, "\', \'");
        collection_instruments_quoted = "\'" + collection_instruments_quoted + "\'"
    
        // create view in mysql
        let stuff = mysqlConnection.query(
            `CALL sp_Create_Collection_View("${collection_instruments_quoted}", "${collection_name}", "${user_id}")`
        );

	console.log(stuff);
        //res.text('done')
        //console.log("done");
    }catch (err){
        console.log("test")
        return res.json({msg: toString(err)});
    }

    return res.json(req.body)
});


module.exports = router;
