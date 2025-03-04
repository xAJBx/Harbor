const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const mysqlConnection = require('../connect');
const { check, validationResult } = require('express-validator');

const User = require('../model/User');

// @route   POST /users
// @decs    Register user
// @access  Public
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
],
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;

    try {
    // See if user exits
        let user = await User.findOne({ email });
        if(user){
            res.status(400).json({ errors: [ { msg: 'User already exists' }] });
        }
    
    // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
    // create instance of user
        user = new User({
            name,
            email,
            avatar,
            password
        });
    // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    // load user to mongo    
        await user.save();
    // Return jsonwebtoken
        const payload = {
            user:{
                id: user.id
            }
        };
        

        // Create MariaDB for sensor data
        mysqlConnection.query(`CALL spCREATE_DATA_TABLE("${user.id}")`);


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