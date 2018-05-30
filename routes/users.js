var express = require('express');
var multer  = require('multer');
var router = express.Router();
var user_controller = require('../controllers/userController');
<<<<<<< HEAD

var upload = multer({ storage: multer.memoryStorage() })
=======
>>>>>>> f58f6240db6c0608ecfc6abf65399674ea7c200f

/* GET users listing. */
router.get('/', ensureAuthenticated, user_controller.user_profile_get);


router.post('/update-pronostic', ensureAuthenticated, user_controller.prono_update_post);
<<<<<<< HEAD

// GET Clôture des pronostics et mise à jour du classement
router.get('/classement', ensureAuthenticated, user_controller.classement_get);

// POST Clôture des pronostics et mise à jour du classement
router.post('/close-game', ensureAuthenticated, user_controller.close_game_post);

// POST Clôture des pronostics et mise à jour du classement
router.post('/set-final-score', ensureAuthenticated, user_controller.set_final_score_post);

// POST Clôture des pronostics et mise à jour du classement
router.post('/generate-classement', ensureAuthenticated, user_controller.update_score_post);

=======

// GET Clôture des pronostics et mise à jour du classement
router.get('/classement', ensureAuthenticated, user_controller.classement_get);

// POST Clôture des pronostics et mise à jour du classement
router.post('/close-game', ensureAuthenticated, user_controller.close_game_post);

// POST Clôture des pronostics et mise à jour du classement
router.post('/set-final-score', ensureAuthenticated, user_controller.set_final_score_post);

// POST Clôture des pronostics et mise à jour du classement
router.post('/generate-classement', ensureAuthenticated, user_controller.update_score_post);

>>>>>>> f58f6240db6c0608ecfc6abf65399674ea7c200f
// POST Clôture des pronostics et mise à jour du classement
router.post('/generate-classement-state', ensureAuthenticated, user_controller.create_classement_post);

router.post('/upload-picture', [ensureAuthenticated, upload.single('avatar')], user_controller.save_avatar_post);

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};
module.exports = router;
