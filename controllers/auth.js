const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const session = require("express-session");

module.exports = router;

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    // res.send('welcome to your path to a better you');
console.log(req.body);
    // user validation
    const userInDatabase = await User.findOne({username:req.body.username});
    const {username, password, confirmPassword} = req.body;
    if (userInDatabase) {
        return res.send('username taken. Try again');
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send(`Passwords must match.`);
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    //creates user
    const user = await User.create(req.body);
    res.render('logs/welcome.ejs')
    
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
})

//SIGN IN ROUTE 
router.post('/sign-in', async (req, res) => {

    //making sure the user is in the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }

    //bcrypt comparing passwords through the hash
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }

    req.session.user = {
        username: userInDatabase.username,
    };
    res.redirect('/');
});

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
