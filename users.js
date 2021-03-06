var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
//var upload = multer({dest: 'uploads/'})
var user_controller = require('../controllers/userController');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.userpseudo+'.jpg')
  }
})

var upload = multer({ storage: storage })

/* GET users listing. */
router.get('/', ensureAuthenticated, user_controller.user_profile_get);


router.post('/update-pronostic', ensureAuthenticated, user_controller.prono_update_post);

// GET Clôture des pronostics et mise à jour du classement
router.get('/classement', ensureAuthenticated, user_controller.classement_get);

// POST Clôture des pronostics et mise à jour du classement
router.post('/close-game', ensureAuthenticated, user_controller.close_game_post);

// POST Clôture des pronostics et mise à jour du classement
router.post('/set-final-score', ensureAuthenticated, user_controller.set_final_score_post);

// POST Clôture des pronostics et mise à jour du classement
router.post('/generate-classement', ensureAuthenticated, user_controller.update_score_post);

// POST Clôture des pronostics et mise à jour du classement
router.post('/generate-classement-state', ensureAuthenticated, user_controller.create_classement_post);

router.post('/upload-picture', user_controller.save_avatar_post);

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};
module.exports = router;
