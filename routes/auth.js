const express = require('express');
const router = express.Router();
const auth = require('.././middleware/auth');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');


// @route   GET /auth
// @decs    Returns authorized user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await (User.findById(req.user.id)).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /auth
// @decs    Authenticate user and get token
// @access  Public
router.post('/',[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password required').exists()
],
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
    // See if user exits
        let user = await User.findOne({ email });
        if(!user){
            res.status(400).json({ errors: [ { msg: 'Invalid Credentials' }] });
        }
    // Check to see if password matches
        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({ errors: [ { msg: 'Invalid Credentials' }] });
        }

    // Return jsonwebtoken
        const payload = {
            user:{
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 3600000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      }
    );

module.exports = router;