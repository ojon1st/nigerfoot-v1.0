var User = require('../models/user');
var async = require('async');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.user_list = function(req, res, next) {
    // Get all authors and genres for form
    async.parallel({
        users: function(callback) {
            User.find()
                .exec(callback);
        },
        
    }, function(err, results) {
        console.log(results);
        /*res.render('plateforme/classe', { title: 'Liste des utilisateurs', users_list:results.users});*/
    });
};


// Display and post Register page
exports.user_profile_get = function(req, res, next) {
    console.log(req.user);
    res.render('profile', { user : req.user });
};


// Display and post Register page
exports.user_register_get = function(req, res, next) {
    res.render('register', {title: 'Créer un Compte' });
};



exports.user_register_post = [

    // Validate that the name field is not empty.
    body('userphone', 'Votre numéro de Téléphonne est requis').isLength({ min: 1 }).trim(),
    body('userpseudo', 'Votre pseudo est requis').isLength({ min: 1 }).trim(),
    body('useremail', 'Votre e-mail est requis').isLength({ min: 1 }).trim(),
    body('userpassword', 'Votre mot de passe est requis').isLength({ min: 1 }).trim(),
    body('userpasswordverif', 'Votre mot de passe de vérification doit être identique').isLength({ min: 1 }).trim(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
     
        // Create a genre object with escaped and trimmed data.
            var user = new User(
              { username: req.body.username,
                userphone: req.body.userphone,
                userpseudo: req.body.userpseudo,
                userpassword: req.body.userpassword,
                usermail: req.body.useremail              
              });
        if (!req.body.userpassword === req.body.userpasswordverif) {
            return res.render('register', { errors : 'Ressaisir votre mot de passe' });
        }
        
       if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('register', { title: 'register', user: user, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Matiere with same name already exists.
            
            User.findOne({ 'userpseudo': req.body.userpseudo })
                .exec( function(err, found_user) {
                     if (err) { return next(err); }

                     if (found_user) {
                         // Matiere exists, redirect to its detail page.
                         res.redirect(found_user.url);
                     }
                     else {
                           user.save(function (err) {
                           if (err) { return next(err); }
                           // Matiere saved. Redirect to matiere detail page.
                               req.flash('success', 'Vous êtes maintenant enregistré et pouvez vous connecter');
                               res.redirect('login');
                           /*passport.authenticate('local')(req, res, () => {
                                req.session.save((err) => {
                                    if (err) {
                                        return next(err);
                                    }
                                    res.redirect('users/');
                                });
                            });*/
                             
                         });
                         
                     }
                 });
        }
    }
];
// Display and post Login page

exports.user_login_get = function(req, res, next){
    res.render('login', {title:'Login' });
};

exports.user_logout_get = function(req, res, next){
    req.logout();
    req.flash('success', 'Vous êtes maintenant déconnecté');
    res.redirect('/');
};
exports.user_login_post = [
    body('userpseudo', 'Veuillez renseigner votre pseudo').isLength({ min: 1 }).trim(),
    passport.authenticate('local',{failureRedirect:'/', failureFlash:'Votre Pseudo ou mot de passe est incorrect.'}),
    (req, res, next) => {
        req.flash('success', 'Vous êtes maintenant connecté');
        console.log('Vous êtes maintenant connecté');
        res.redirect('users/');
    
        /*req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('users/');
        });*/
        
    }
];

// Display and post logout Page

/*exports.user_logout_post = [
    body('userpseudo', 'Matiere code required').isLength({ min: 1 }).trim(),
    (req, res, next) => {
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('users/');
        });
        
    }
];*/

// Display list of all Matiere.




/*function(req, res, next) {

    User.register(new User({ userphone : req.body.usertelephone.replace(/\s/g,'') }), req.body.userpassword, (err, user) => {
        

        
    });
};*/
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy({
    usernameField: 'userpseudo',
    passwordField: 'userpassword'
    
}, function(username, password, done){
    
    User.findOne({ 'userpseudo': username})
                .exec(function(err, found_user) {
                     if (err) throw err;//{ return next(err); }
                     if(!found_user){
                         return done(null, false, {message:'L\'utilisateur ' + username + ' est inconnu'});
                     }
                     // User found and compare password.
                     found_user.comparePassword(password, found_user.userpassword, function(err, isMatch){
                         if(err) return done(err);
                         if(isMatch){
                             return done(null, found_user);
                         } else{
                             return done(null, false, {message: 'Le mot de passe est invalide'});
                         }
                     });                    
                })
}));