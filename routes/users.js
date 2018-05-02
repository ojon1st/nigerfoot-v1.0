var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/usercontroller');

/* GET users listing. */
router.get('/', ensureAuthenticated, user_controller.user_profile_get);


router.post('/update-pronostic', user_controller.prono_update_post);

/*
{
  res.render('profile', { user : req.user });
});
*/


function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};
module.exports = router;
