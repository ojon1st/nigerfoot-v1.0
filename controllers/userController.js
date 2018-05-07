var User = require('../models/user');
var Team = require('../models/team');
var Groupe = require('../models/groupe');
var Game = require('../models/game');
var async = require('async');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');



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
    // Get all authors and genres for form
    async.parallel({
        games: function(callback) {
            Game.find()
                .populate({ path: 'team1', select: ['teamname','teamgroup']})
                .populate({ path: 'team2', select: ['teamname','teamgroup']})
                .sort('gamenumber')
                .exec(callback);
        },
        teams: function(callback) {
            Team.find()
                .exec(callback);
        },
        users: function(callback) {
            User.find()
                .exec(callback);
        },
        groupes: function(callback) {
            User.findOne({'_id':req.user._id},'joinedGroups')
                .populate({path: 'joinedGroups', populate:{path:'joinedUsers',select:'userpseudo'}, populate:{path:'joinedUsers',select:'userpseudo'}})
                .populate({path: 'joinedGroups', populate:{path:'createdBy',select:'userpseudo'}}).exec(callback);
        },
        groupe: function(callback) {
            Groupe.findOne({'createdBy':req.user._id}).populate({ path: 'joinedUsers', populate: {path:'user'},select:'userpseudo'}).exec(callback);
        }, 
    }, function(err, results) {
        if (err) {return next(err);}
        
        /*console.log(req.user.joinedGroups)*/
        console.log(results.groupes.joinedGroups)
        
        res.render('profile', {title:'Mon Profil', user:req.user, list_games:results.games, list_teams:results.teams, list_users:results.users, groupes:results.groupes.joinedGroups, mongroupe:results.groupe});
    });
    /*res.render('profile', { user : req.user });*/
};

exports.prono_update_post = [    // Validate that the name field is not empty.

    // Process request after validation and sanitization.
    (req, res, next) => {
        /*console.log(req.user);
        return*/
        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a matiere object with escaped and trimmed data (and the old id!)
        var user = new User({
                    _id:req.user._id,
                    userprono:{prteam11:req.body.prteam11,
                               prteam12:req.body.prteam12,
                               prteam21:req.body.prteam21,
                               prteam22:req.body.prteam22,
                            prteam31:req.body.prteam31,
                            prteam32:req.body.prteam32,
                            prteam41:req.body.prteam41,
                            prteam42:req.body.prteam42,
                            prteam51:req.body.prteam51,
                            prteam52:req.body.prteam52,
                            prteam61:req.body.prteam61,
                            prteam62:req.body.prteam62,
                            prteam71:req.body.prteam71,
                            prteam72:req.body.prteam72,
                            prteam81:req.body.prteam81,
                            prteam82:req.body.prteam82,
                            prteam91:req.body.prteam91,
                            prteam92:req.body.prteam92,
                            prteam101:req.body.prteam101,
                            prteam102:req.body.prteam102,
                            prteam111:req.body.prteam111,
                            prteam112:req.body.prteam112,
                            prteam121:req.body.prteam121,
                            prteam122:req.body.prteam122,
                            prteam131:req.body.prteam131,
                            prteam132:req.body.prteam132,
                            prteam141:req.body.prteam141,
                            prteam142:req.body.prteam142,
                            prteam151:req.body.prteam151,
                            prteam152:req.body.prteam152,
                            prteam161:req.body.prteam161,
                            prteam162:req.body.prteam162,
                            prteam171:req.body.prteam171,
                            prteam172:req.body.prteam172,
                            prteam181:req.body.prteam181,
                            prteam182:req.body.prteam182,
                            prteam191:req.body.prteam191,
                            prteam192:req.body.prteam192,
                            prteam201:req.body.prteam201,
                            prteam202:req.body.prteam202,
                            prteam211:req.body.prteam211,
                            prteam212:req.body.prteam212,
                            prteam221:req.body.prteam221,
                            prteam222:req.body.prteam222,
                            prteam231:req.body.prteam231,
                            prteam232:req.body.prteam232,
                            prteam241:req.body.prteam241,
                            prteam242:req.body.prteam242,
                            prteam251:req.body.prteam251,
                            prteam252:req.body.prteam252,
                            prteam261:req.body.prteam261,
                            prteam262:req.body.prteam262,
                            prteam271:req.body.prteam271,
                            prteam272:req.body.prteam272,
                            prteam281:req.body.prteam281,
                            prteam282:req.body.prteam282,
                            prteam291:req.body.prteam291,
                            prteam292:req.body.prteam292,
                            prteam301:req.body.prteam301,
                            prteam302:req.body.prteam302,
                            prteam311:req.body.prteam311,
                            prteam312:req.body.prteam312,
                            prteam321:req.body.prteam321,
                            prteam322:req.body.prteam322,
                            prteam331:req.body.prteam331,
                            prteam332:req.body.prteam332,
                            prteam341:req.body.prteam341,
                            prteam342:req.body.prteam342,
                            prteam351:req.body.prteam351,
                            prteam352:req.body.prteam352,
                            prteam361:req.body.prteam361,
                            prteam362:req.body.prteam362,
                            prteam371:req.body.prteam371,
                            prteam372:req.body.prteam372,
                            prteam381:req.body.prteam381,
                            prteam382:req.body.prteam382,
                            prteam391:req.body.prteam391,
                            prteam392:req.body.prteam392,
                            prteam401:req.body.prteam401,
                            prteam402:req.body.prteam402,
                            prteam411:req.body.prteam411,
                            prteam412:req.body.prteam412,
                            prteam421:req.body.prteam421,
                            prteam422:req.body.prteam422,
                            prteam431:req.body.prteam431,
                            prteam432:req.body.prteam432,
                            prteam441:req.body.prteam441,
                            prteam442:req.body.prteam442,
                            prteam451:req.body.prteam451,
                            prteam452:req.body.prteam452,
                            prteam461:req.body.prteam461,
                            prteam462:req.body.prteam462,
                            prteam471:req.body.prteam471,
                            prteam472:req.body.prteam472,
                            prteam481:req.body.prteam481,
                            prteam482:req.body.prteam482}
                });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('profile', {title: 'pronostic', user: user, errors: errors.array()});
            return;
        }
        else {
            console.log(req.user)
            // Data from form is valid. Update the record.
            User.update({ _id: req.user._id}, 
                        {$set: {
                        "userprono.prteam11": req.body.prteam11,
                        "userprono.prteam12": req.body.prteam12,
                        "userprono.prteam21": req.body.prteam21,
                        "userprono.prteam22": req.body.prteam22,
                        "userprono.prteam31": req.body.prteam31,
                        "userprono.prteam32": req.body.prteam32,
                        "userprono.prteam41": req.body.prteam41,
                        "userprono.prteam42": req.body.prteam42,
                        "userprono.prteam51": req.body.prteam51,
                        "userprono.prteam52": req.body.prteam52,
                        "userprono.prteam61": req.body.prteam61,
                        "userprono.prteam62": req.body.prteam62,
                        "userprono.prteam71": req.body.prteam71,
                        "userprono.prteam72": req.body.prteam72,
                        "userprono.prteam81": req.body.prteam81,
                        "userprono.prteam82": req.body.prteam82,
                        "userprono.prteam91": req.body.prteam91,
                        "userprono.prteam92": req.body.prteam92,
                        "userprono.prteam101": req.body.prteam101,
                        "userprono.prteam102": req.body.prteam102,
                        "userprono.prteam111": req.body.prteam111,
                        "userprono.prteam112": req.body.prteam112,
                        "userprono.prteam121": req.body.prteam121,
                        "userprono.prteam122": req.body.prteam122,
                        "userprono.prteam131": req.body.prteam131,
                        "userprono.prteam132": req.body.prteam132,
                        "userprono.prteam141": req.body.prteam141,
                        "userprono.prteam142": req.body.prteam142,
                        "userprono.prteam151": req.body.prteam151,
                        "userprono.prteam152": req.body.prteam152,
                        "userprono.prteam161": req.body.prteam161,
                        "userprono.prteam162": req.body.prteam162,
                        "userprono.prteam171": req.body.prteam171,
                        "userprono.prteam172": req.body.prteam172,
                        "userprono.prteam181": req.body.prteam181,
                        "userprono.prteam182": req.body.prteam182,
                        "userprono.prteam191": req.body.prteam191,
                        "userprono.prteam192": req.body.prteam192,
                        "userprono.prteam201": req.body.prteam201,
                        "userprono.prteam202": req.body.prteam202,
                        "userprono.prteam211": req.body.prteam211,
                        "userprono.prteam212": req.body.prteam212,
                        "userprono.prteam221": req.body.prteam221,
                        "userprono.prteam222": req.body.prteam222,
                        "userprono.prteam231": req.body.prteam231,
                        "userprono.prteam232": req.body.prteam232,
                        "userprono.prteam241": req.body.prteam241,
                        "userprono.prteam242": req.body.prteam242,
                        "userprono.prteam251": req.body.prteam251,
                        "userprono.prteam252": req.body.prteam252,
                        "userprono.prteam261": req.body.prteam261,
                        "userprono.prteam262": req.body.prteam262,
                        "userprono.prteam271": req.body.prteam271,
                        "userprono.prteam272": req.body.prteam272,
                        "userprono.prteam281": req.body.prteam281,
                        "userprono.prteam282": req.body.prteam282,
                        "userprono.prteam291": req.body.prteam291,
                        "userprono.prteam292": req.body.prteam292,
                        "userprono.prteam301": req.body.prteam301,
                        "userprono.prteam302": req.body.prteam302,
                        "userprono.prteam311": req.body.prteam311,
                        "userprono.prteam312": req.body.prteam312,
                        "userprono.prteam321": req.body.prteam321,
                        "userprono.prteam322": req.body.prteam322,
                        "userprono.prteam331": req.body.prteam331,
                        "userprono.prteam332": req.body.prteam332,
                        "userprono.prteam341": req.body.prteam341,
                        "userprono.prteam342": req.body.prteam342,
                        "userprono.prteam351": req.body.prteam351,
                        "userprono.prteam352": req.body.prteam352,
                        "userprono.prteam361": req.body.prteam361,
                        "userprono.prteam362": req.body.prteam362,
                        "userprono.prteam371": req.body.prteam371,
                        "userprono.prteam372": req.body.prteam372,
                        "userprono.prteam381": req.body.prteam381,
                        "userprono.prteam382": req.body.prteam382,
                        "userprono.prteam391": req.body.prteam391,
                        "userprono.prteam392": req.body.prteam392,
                        "userprono.prteam401": req.body.prteam401,
                        "userprono.prteam402": req.body.prteam402,
                        "userprono.prteam411": req.body.prteam411,
                        "userprono.prteam412": req.body.prteam412,
                        "userprono.prteam421": req.body.prteam421,
                        "userprono.prteam422": req.body.prteam422,
                        "userprono.prteam431": req.body.prteam431,
                        "userprono.prteam432": req.body.prteam432,
                        "userprono.prteam441": req.body.prteam441,
                        "userprono.prteam442": req.body.prteam442,
                        "userprono.prteam451": req.body.prteam451,
                        "userprono.prteam452": req.body.prteam452,
                        "userprono.prteam461": req.body.prteam461,
                        "userprono.prteam462": req.body.prteam462,
                        "userprono.prteam471": req.body.prteam471,
                        "userprono.prteam472": req.body.prteam472,
                        "userprono.prteam481": req.body.prteam481,
                        "userprono.prteam482": req.body.prteam482
                        }
                 }, {upsert:true, multi:true, returnOriginal:true}, function (err) {
                if (err) {return next(err);}
                    
                   // Successful - redirect to matiere detail page.
                   res.redirect('/users');
                });
        }
    }
];
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

exports.create_group_post = [

    // Validate that the name field is not empty.
    body('groupname', 'Le nom du Groupe est requis').isLength({ min: 1 }).trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        // Create a genre object with escaped and trimmed data.
            var groupe = new Groupe({
                groupname: req.body.groupname,
                createdBy: req.user._id});
        
       
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('profile', { title: 'Profile', errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Matiere with same name already exists.
            
            Groupe.findOne({'createdBy': req.user._id})
                .exec( function(err, found_group) {
                     if (err) { return next(err); }

                     if (found_group) {
                         // Matiere exists, redirect to its detail page.
                         res.redirect('/users');
                     }
                     else { 
                         groupe.save(function (err) {
                           if (err) { return next(err); }
                           // Matiere saved. Redirect to matiere detail page.
                             res.redirect('/users');
                         });
                     }
                 });
        }
    }
];

exports.update_group_post = [
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        
        var validphonenumbers = [];
        for (i=1; i < 16; i++){
            var phonemember = req.body['userphone'+i];
            if(phonemember != null && phonemember != '' && phonemember.length == 8){
                validphonenumbers.push(phonemember);}
        }
    
        if (validphonenumbers.length <= 0){

            return res.redirect('/users');
        }
        
        
        Groupe.findOne({'createdBy': req.user._id})
                .exec(function(err, found_group) {
                     if (err) { return next(err); }
                if(!found_group){
                    return res.redirect('/users');
                }
                else{
                        User.find({'userphone': { $in: validphonenumbers }},function(err, users) {
                          users.forEach(function(theuser) {
                              
                              theuser.joinedGroups.push(found_group);
                              theuser.save(function (err) {
                                  found_group.joinedUsers.push(theuser);
                                  found_group.save();
                                });
                            /*theuser.joinedGroups.cid = '';
                            device.save();*/
                          });
                        });
                        
                        res.redirect('/users')
                }
            
        });
    }
];


// Admin.

exports.game_create_get = function(req, res, next) {
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        teams: function (callback) {
            Team.find(callback);
        },
        /*sous_matieres: function (callback) {
            Sous_Matiere.find(callback);
        },*/
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        res.render('admin', {title: 'Create Game', teams: results.teams});
    });
    
};
exports.game_create_post = [

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
     
        // Create a genre object with escaped and trimmed data.
            var game = new Game(
              { gamenumber:req.body.gamenumber,
                gametype:req.body.gametype,
                team1: req.body.team1,
                team2: req.body.team2,
                rteam1: req.body.rteam1,
                rteam2: req.body.rteam2,
                gamedate:req.body.gamedate,
                gamestadium:req.body.gamestadium,
                gameplace:req.body.gameplace,
                started: req.body.started}
            );
        
       
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            // Get all authors and genres for form.
            async.parallel({
                teams: function (callback) {
                    Team.find(callback);
                },/*
                chapitres: function (callback) {
                    Chapitre.find(callback);
                },*/
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('admin', { title: 'Create Game', teams:results.teams, errors: errors.array()});
            });
            return;
            
        }
        else {
            // Data from form is valid.
            // Check if Chapitre with same name already exists.
            console.log(game)
            /*return;*/
            game.save(function (err) {
               if (err) { return next(err); }
               // Matiere saved. Redirect to matiere detail page.
               /*res.redirect(matiere.url);*/
                 res.redirect(game.urlupdate);
             });
        }
    }
];
exports.game_update_get = function(req, res, next) {
    
    
    
    // Get book, authors and genres for form.
    async.parallel({
        game: function(callback) {
            Game.findById(req.params.id).populate('team').exec(callback);
        },
        teams: function(callback) {
            Team.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.game==null) { // No results.
                var err = new Error('Game not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('admin', { title: 'Update Game', teams:results.teams, game:results.game });
        });
};
exports.game_update_post = [
   
    
     // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a matiere object with escaped and trimmed data (and the old id!)
         var game = new Game(
              { _id:req.params.id,
                gamenumber:req.body.gamenumber,
                gametype:req.body.gametype,
                team1: req.body.team1,
                team2: req.body.team2,
                rteam1: req.body.rteam1,
                rteam2: req.body.rteam2,
                gamedate:req.body.gamedate,
                gamestadium:req.body.gamestadium,
                gameplace:req.body.gameplace,
                started: req.body.started}
            );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            
            
             // Get all authors and genres for form
            async.parallel({
                game: function(callback) {
                    Game.findById(req.params.id).populate('team').exec(callback);
                },
                teams: function(callback) {
                    Team.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('admin', { title: 'Update Game', teams:results.teams, game:results.game, errors: errors.array() });
            });
            
        return;
        }
        else {
            /*
              var gameToUpdate = {};
              gameToUpdate = Object.assign(gameToUpdate, game._doc);
              delete gameToUpdate._id;*/
            
            // Data from form is valid. Update the record.
            Game.findByIdAndUpdate(req.params.id, game, {returnOriginal:true}, function (err,thegame) {
                if (err) { return next(err); }
                   // Successful - redirect to matiere detail page.
                   res.redirect(thegame.urlupdate);
                });
        }
    }
];





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