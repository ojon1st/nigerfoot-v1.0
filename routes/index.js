const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();
var user_controller = require('../controllers/usercontroller');

router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});


// Register
router.get('/register', user_controller.user_register_get);
/*router.get('/register', (req, res) => {
    res.render('register', { });
});*/

router.post('/register', user_controller.user_register_post);

//Login
router.get('/login', user_controller.user_login_get);

router.post('/login', user_controller.user_login_post);

// Logout
router.get('/logout', user_controller.user_logout_get);


//Admin
// GET request for creating a chapitre. NOTE This must come before route that displays chapitre (uses id).
router.get('/game/create', user_controller.game_create_get);

// POST request for creating chapitre.
router.post('/game/create', user_controller.game_create_post);

// GET request to update chapitre.
router.get('/game/:id/update', user_controller.game_update_get);

// POST request to update chapitre.
router.post('/game/:id/update', user_controller.game_update_post);

//POST propnostics
router.post('/sumbit_pronostic', user_controller.prono_update_post);


//POST Create or Update Group
router.post('/create_group', user_controller.create_group_post);


//POST Create or Update Group
router.post('/update_group', user_controller.update_group_post);

/*
router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login',passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), user_controller.user_login_post);

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

*/


module.exports = router;
