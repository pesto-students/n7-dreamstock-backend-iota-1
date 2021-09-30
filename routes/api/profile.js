const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// User model
const User = require('../../models/User');


// @route   GET api/profile/myprofile
// @desc    Get post by id
// @access  Private to users logged in
router.get('/myprofile', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user.id)
        .then(userDetails => {
            console.log('my profile',userDetails)
            res.json(userDetails)
        })
        .catch(err =>
            res.status(404).json({ nopostfound: 'No userDetails found with that ID' })
        );
});



module.exports = router;
