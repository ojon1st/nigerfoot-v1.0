var User = require('../models/user');
var Team = require('../models/team');
var Groupe = require('../models/groupe');
var Game = require('../models/game');
var Rank = require('../models/classement');
var async = require('async');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var {
    body,
    validationResult
} = require('express-validator/check');
var {
    sanitizeBody
} = require('express-validator/filter');

var cloudinary = require('cloudinary');
var Datauri = require('datauri');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET )

exports.user_list = function (req, res, next) {
    // Get all authors and genres for form
    async.parallel({
        users: function (callback) {
            User.find()
                .exec(callback);
        },

    }, function (err, results) {
        console.log(results);
        /*res.render('plateforme/classe', { title: 'Liste des utilisateurs', users_list:results.users});*/
    });
};


// Display and post Register page
exports.user_profile_get = function (req, res, next) {
    // Get all authors and genres for form
    async.parallel({
        games: function (callback) {
            Game.find()
                .populate({
                    path: 'team1',
                    select: ['teamname', 'teamgroup']
                })
                .populate({
                    path: 'team2',
                    select: ['teamname', 'teamgroup']
                })
                .sort({
                    gametype: 1,
                    gamedate: 1
                })
                .exec(callback);
        },
        teams: function (callback) {
            Team.find()
                .exec(callback);
        },
        users: function (callback) {
            User.find()
                .exec(callback);
        },
        groupes: function (callback) {
            User.findOne({
                    '_id': req.user._id
                }, 'joinedGroups')
                .populate({
                    path: 'joinedGroups',
                    populate: {
                        path: 'joinedUsers',
                        select: 'userpseudo'
                    },
                    populate: {
                        path: 'joinedUsers',
                        select: 'userpseudo'
                    }
                })
                .populate({
                    path: 'joinedGroups',
                    populate: {
                        path: 'createdBy',
                        select: 'userpseudo'
                    }
                }).exec(callback);
        },
        groupe: function (callback) {
            Groupe.findOne({
                'createdBy': req.user._id
            }).populate({
                path: 'joinedUsers',
                populate: {
                    path: 'user'
                },
                select: 'userpseudo'
            }).exec(callback);
        },
        rankmax: function (callback) {
            Rank.find({}).sort({'_id':-1}).limit(1).exec(callback);
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
      //console.log(results.rankmax[0]['rankstate']); return
        async.parallel({
            myrank: function (callback) {
                results.rankmax[0].rankstate.forEach(function (theuser) {
                    
                    if (theuser.usrid.toString() == req.user._id) {
                        myrank = theuser;
                    }

                });
                callback(null, myrank);

            },
            mongroupeusersarray: function (callback) { // Tableau de tous les users de mon *groupe*
                setTimeout(function () {
                    var mongroupeusersarray = [];
                    if (results.groupe) {

                        mongroupeusersarray.push(results.groupe.createdBy.toString());
                        for (var i = 0; i < results.groupe.joinedUsers.length; i++) {
                            var joineduser = results.groupe.joinedUsers[i];
                            mongroupeusersarray.push(joineduser._id.toString());
                        }
                    }
                    callback(null, mongroupeusersarray);
                }, 500);
            },
            mesgroupesusersarray: function (callback) {
                setTimeout(function () {
                    var mesgroupesusersarray = [];
                    if (results.groupes) {

                        results.groupes.joinedGroups.forEach(function (thegroup) {
                            
                            var thisgroupeusersarray = [];
                            thisgroupeusersarray.push(thegroup.createdBy._id.toString());
                            for (var i = 0; i < thegroup.joinedUsers.length; i++) {
                                var joineduser = thegroup.joinedUsers[i];
                                thisgroupeusersarray.push(joineduser._id.toString());
                            }
                            mesgroupesusersarray.push(thisgroupeusersarray)
                        });
                    }
                    callback(null, mesgroupesusersarray);
                }, 1000);
            }
        }, function (err, resultats) {
            if (err) {
                return next(err);
            }

            async.parallel({
                mygrouperank: function (callback) {
                    setTimeout(function () {
                        var mongroupeclassarray = [];
                        if (results.groupe) {
                            var newarray = [];
                            newarray = resultats.mongroupeusersarray;
                            var newstring = '';
                            results.rankmax[0].rankstate.forEach(function (theuser) {
                                newstring = theuser.usrid.toString();

                                if (newarray.includes(newstring)) {
                                    mongroupeclassarray.push(theuser)
                                }

                            });
                        }
                        callback(null, mongroupeclassarray);
                    }, 500);
                },
                allmygroupsranks: function (callback) {
                    setTimeout(function () {
                        var mesgroupesusersarray = resultats.mesgroupesusersarray;
                        var mesgroupesclassarray = [];

                        if (results.groupes) {
                            for (var i = 0; i < mesgroupesusersarray.length; i++) {
                                var thisgroupusersarray = mesgroupesusersarray[i];
                                var thisgroupclassarray = [];
                                var newstring = '';
                                results.rankmax[0].rankstate.forEach(function (theuser) {
                                    newstring = theuser.usrid.toString();

                                    if (thisgroupusersarray.includes(newstring)) {
                                        thisgroupclassarray.push(theuser);
                                    }

                                });

                                mesgroupesclassarray.push(thisgroupclassarray);
                            }

                        }

                        callback(null, mesgroupesclassarray);
                    }, 1000);
                }
            }, function (err, resultat_final) {
                if (err) {
                    return next(err);
                }
                
                res.render('profile', {
                    title: 'Mon Profil',
                    user: req.user,
                    list_games: results.games,
                    list_teams: results.teams,
                    list_users: results.users,
                    groupes: results.groupes.joinedGroups,
                    mongroupe: results.groupe,
                    rankmax: results.rankmax[0],
                    myrank: resultats.myrank,
                    groupesranks: resultat_final.allmygroupsranks,
                    mongrouperank: resultat_final.mygrouperank
                });

            });

        });
    });

};

exports.prono_update_post = [ // Validate that the name field is not empty.

    // Process request after validation and sanitization.
    (req, res, next) => {
        /*console.log(req.user);
        return*/
        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a matiere object with escaped and trimmed data (and the old id!)
        var user = new User({
            _id: req.user._id,
            userprono: {
                prteam11: req.body.prteam11,
                prteam12: req.body.prteam12,
                prteam21: req.body.prteam21,
                prteam22: req.body.prteam22,
                prteam31: req.body.prteam31,
                prteam32: req.body.prteam32,
                prteam41: req.body.prteam41,
                prteam42: req.body.prteam42,
                prteam51: req.body.prteam51,
                prteam52: req.body.prteam52,
                prteam61: req.body.prteam61,
                prteam62: req.body.prteam62,
                prteam71: req.body.prteam71,
                prteam72: req.body.prteam72,
                prteam81: req.body.prteam81,
                prteam82: req.body.prteam82
            }
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('profile', {
                title: 'pronostic',
                user: user,
                errors: errors.array()
            });
            return;
        } else {
            console.log(req.user)
            // Data from form is valid. Update the record.
            User.update({
                _id: req.user._id
            }, {
                $set: {
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
                    "userprono.prteam82": req.body.prteam82
                }
            }, {
                upsert: true,
                multi: true,
                returnOriginal: true
            }, function (err) {
                if (err) {
                    return next(err);
                }

                // Successful - redirect to matiere detail page.
                res.redirect('/users');
            });
        }
    }
];
// Display and post Register page
exports.user_register_get = function (req, res, next) {
    res.render('register', {
        title: 'Créer un Compte'
    });
};



exports.user_register_post = [

    // Validate that the name field is not empty.
    body('userphone', 'Votre numéro de Téléphonne est requis').isLength({
        min: 1
    }).trim(),
    body('userpseudo', 'Votre pseudo est requis').isLength({
        min: 1
    }).trim(),
    body('useremail', 'Votre e-mail est requis').isLength({
        min: 1
    }).trim(),
    body('userpassword', 'Votre mot de passe est requis').isLength({
        min: 1
    }).trim(),
    body('userpasswordverif', 'Votre mot de passe de vérification doit être identique').isLength({
        min: 1
    }).trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);


        // Create a genre object with escaped and trimmed data.
        var user = new User({
            username: req.body.username,
            userphone: req.body.userphone,
            userpseudo: req.body.userpseudo,
            userpassword: req.body.userpassword,
            usermail: req.body.useremail
        });
        if (!req.body.userpassword === req.body.userpasswordverif) {
            return res.render('register', {
                errors: 'Ressaisir votre mot de passe'
            });
        }

        if (!errors.isEmpty()) {

            // There are errors. Render the form again with sanitized values/error messages.
            res.render('register', {
                title: 'register',
                user: user,
                errors: errors.array()
            });
            return;
        } else {
            async.parallel({
                tel: function (callback) {
                    User.findOne({
                            'userphone': req.body.userphone
                        })
                        .exec(callback);
                },
                pseudo: function (callback) {
                    User.findOne({
                            'userpseudo': req.body.userpseudo
                        })
                        .exec(callback);
                },
                mail: function (callback) {
                    User.findOne({'usermail': req.body.usermail}).exec(callback);
                }
            }, function (err, founduser) {
                if (err) {
                    return next(err);
                }
                
                
                if (founduser.tel) {
                    // User exists, with same tel.
                    req.flash('error', 'Le Numéro de téléphone saisi existe déjà');
                    res.render('register', {
                        title: 'register',
                        user: user
                    });
                    return;
                } else if (founduser.pseudo) {
                    // User exists, with same pseudo.
                    req.flash('error', 'Le pseudo saisi existe déjà');
                    res.render('register', {
                        title: 'register',
                        user: user
                    });
                    return;
                } else if (founduser.mail) {
                    // User exists, with same email.
                    req.flash('error', 'L\'email saisi existe déjà');
                    res.render('register', {
                        title: 'register',
                        user: user
                    });
                    return;
                } else {
                    
                    user.save(function (err) {
                        if (err) {

                            // Duplicate user
                            if (err && err.code === 11000) {
                                req.flash('error', 'Cet utilisateur existe déjà');
                                res.render('register', {
                                    title: 'register',
                                    user: user,
                                    errors: errors.array()
                                });
                                return next(err);
                            }

                        }
                        Rank.findOne()
                            .sort({
                                rankaftergame: -1
                            })
                            .exec(function (err, last_rank) {
                                if (err) {
                                    return next(err);
                                }

                                if (last_rank) {
                                                                        
                                    var last_user_ranked = last_rank.rankstate[last_rank.rankstate.length - 1];
                                    var last_rank_value = last_user_ranked.usrrank;
                                    last_rank.rankstate.push({
                                        usrid: user._id,
                                        usrpseudo: user.userpseudo,
                                        usrscore: 0,
                                        usrrank: last_rank_value
                                    });
                                    last_rank.save();
                                    // Matiere saved. Redirect to matiere detail page.
                                    req.flash('success', 'Vous êtes maintenant enregistré et pouvez vous connecter');
                                    res.redirect('login');

                                }
                            });


                    });


                }
            });
        }
    }
];
// Display and post Login page

exports.user_login_get = function (req, res, next) {
    res.render('login', {
        title: 'Login'
    });
};


exports.user_fpassword_get = function (req, res, next) {
    res.render('forgotpassword', {
        title: 'Mot de passe oublié'
    });
}

exports.user_fpassword_post = [

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);


        // Create a genre object with escaped and trimmed data.
        var user = new User({
            userphone: req.body.userphone,
            userpseudo: req.body.userpseudo,
            usermail: req.body.useremail
        });


        if (!errors.isEmpty()) {

            // There are errors. Render the form again with sanitized values/error messages.
            res.render('forgotpassword', {
                title: 'Mot de Passe oublié',
                user: user,
                errors: errors.array()
            });
            return;
        } else {
            //console.log('ok')
            User.findOne({
                userphone: req.body.userphone,
                usermail: req.body.usermail,
                userpseudo: req.body.userpseudo
            }).exec(function (err, found_user) {
                //console.log('exec function')
                if (err) {
                    return next(err)
                }
                if (!found_user) {
                    return done(null, false, {
                        message: 'L\'utilisateur ' + req.body.userpseudo + ' est inconnu'
                    });
                }
                // User found and compare password.

                //console.log(found_user);
                res.render('newpassword', {
                    title: 'Nouveau Mot de Passe',
                    user: found_user
                });
                return;
            });

        }
    }
];

exports.user_newpassword_post = [
     // Process request after validation and sanitization.
    (req, res, next) => {

        if (!req.body.userpassword === req.body.userpasswordverif) {
            return res.render('newpassword', {
                errors: 'Ressaisir votre mot de passe'
            });
        }


        User.findOne({
            _id: req.params.id
        }).exec(function (err, theuserwithnewpswd) {
            //console.log('exec function')
            if (err) {
                return next(err)
            }
            theuserwithnewpswd.userpassword = req.body.userpassword;
            theuserwithnewpswd.save();
            //console.log(found_user);
            res.redirect('/login');

        });
    }
];

exports.user_logout_get = function (req, res, next) {
    req.logout();
    req.flash('success', 'Vous êtes maintenant déconnecté. Renseigner les infos pour vous connecter à nouveau.');
    res.redirect('/');
};
exports.user_login_post = [
    body('userpseudo', 'Veuillez renseigner votre pseudo').isLength({
        min: 1
    }).trim(),
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Votre Pseudo ou mot de passe est incorrect.'
    }),
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
    body('groupname', 'Le nom du Groupe est requis').isLength({
        min: 1
    }).trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var groupe = new Groupe({
            groupname: req.body.groupname,
            createdBy: req.user._id
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('profile', {
                title: 'Profile',
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.
            // Check if Matiere with same name already exists.

            Groupe.findOne({
                    'createdBy': req.user._id
                })
                .exec(function (err, found_group) {
                    if (err) {
                        return next(err);
                    }

                    if (found_group) {
                        // Matiere exists, redirect to its detail page.
                        res.redirect('/users');
                    } else {
                        groupe.save(function (err) {
                            if (err) {
                                return next(err);
                            }
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
        for (i = 1; i < 16; i++) {
            var phonemember = req.body['userphone' + i];
            if (phonemember != null && phonemember != '' && phonemember.length == 8) {
                validphonenumbers.push(phonemember);
            }
        }

        if (validphonenumbers.length <= 0) {

            return res.redirect('/users');
        }


        Groupe.findOne({
                'createdBy': req.user._id
            })
            .exec(function (err, found_group) {
                if (err) {
                    return next(err);
                }
                if (!found_group) {
                    return res.redirect('/users');
                } else {
                    User.find({
                        'userphone': {
                            $in: validphonenumbers
                        }
                    }, function (err, users) {
                        users.forEach(function (theuser) {

                            theuser.joinedGroups.push(found_group);
                            theuser.save(function (err) {
                                found_group.joinedUsers.push(theuser);
                                found_group.save();
                            });

                        });
                    });

                    res.redirect('/users')
                }

            });
    }
];


// Admin.

exports.game_create_get = function (req, res, next) {
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
        res.render('admin', {
            title: 'Create Game',
            teams: results.teams
        });
    });

};
exports.game_create_post = [

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);


        // Create a genre object with escaped and trimmed data.
        var game = new Game({
            gamenumber: req.body.gamenumber,
            gametype: req.body.gametype,
            team1: req.body.team1,
            team2: req.body.team2,
            rteam1: req.body.rteam1,
            rteam2: req.body.rteam2,
            gamedate: req.body.gamedate,
            gamestadium: req.body.gamestadium,
            gameplace: req.body.gameplace,
            started: req.body.started
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            // Get all authors and genres for form.
            async.parallel({
                teams: function (callback) {
                    Team.find(callback);
                },
                /*
                                chapitres: function (callback) {
                                    Chapitre.find(callback);
                                },*/
            }, function (err, results) {
                if (err) {
                    return next(err);
                }

                res.render('admin', {
                    title: 'Create Game',
                    teams: results.teams,
                    errors: errors.array()
                });
            });
            return;

        } else {
            // Data from form is valid.
            // Check if Chapitre with same name already exists.
            console.log(game)
            /*return;*/
            game.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Matiere saved. Redirect to matiere detail page.
                /*res.redirect(matiere.url);*/
                res.redirect(game.urlupdate);
            });
        }
    }
];
exports.game_update_get = function (req, res, next) {



    // Get book, authors and genres for form.
    async.parallel({
        game: function (callback) {
            Game.findById(req.params.id).populate('team').exec(callback);
        },
        teams: function (callback) {
            Team.find(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.game == null) { // No results.
            var err = new Error('Game not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('admin', {
            title: 'Update Game',
            teams: results.teams,
            game: results.game
        });
    });
};
exports.game_update_post = [


     // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a matiere object with escaped and trimmed data (and the old id!)
        var game = new Game({
            _id: req.params.id,
            gamenumber: req.body.gamenumber,
            gametype: req.body.gametype,
            team1: req.body.team1,
            team2: req.body.team2,
            rteam1: req.body.rteam1,
            rteam2: req.body.rteam2,
            gamedate: req.body.gamedate,
            gamestadium: req.body.gamestadium,
            gameplace: req.body.gameplace,
            started: req.body.started
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.


            // Get all authors and genres for form
            async.parallel({
                game: function (callback) {
                    Game.findById(req.params.id).populate('team').exec(callback);
                },
                teams: function (callback) {
                    Team.find(callback);
                },
            }, function (err, results) {
                if (err) {
                    return next(err);
                }
                res.render('admin', {
                    title: 'Update Game',
                    teams: results.teams,
                    game: results.game,
                    errors: errors.array()
                });
            });

            return;
        } else {
            /*
              var gameToUpdate = {};
              gameToUpdate = Object.assign(gameToUpdate, game._doc);
              delete gameToUpdate._id;*/

            // Data from form is valid. Update the record.
            Game.findByIdAndUpdate(req.params.id, game, {
                returnOriginal: true
            }, function (err, thegame) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to matiere detail page.
                res.redirect(thegame.urlupdate);
            });
        }
    }
];


exports.classement_get = function (req, res, next) {
    async.parallel({
        games_not_started: function (callback) {
            Game.find({
                    started: 'false'
                })
                .sort({
                    gamedate: 1
                })
                .exec(callback);
        },
        games_started: function (callback) {
            Game.find({
                    started: 'true'
                })
                .sort({
                    gamedate: -1
                })
                .exec(callback);
        },
        rankmax: function (callback) {
            Rank.find()
                .sort({'_id':-1}).limit(1)
                .exec(callback);
        },
       rankstates:function (callback){
         Rank.find().exec(callback);
       }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        var games_ranked = [];
        results.rankstates.forEach(function(game_ranked){
          games_ranked.push(game_ranked.rankaftergame)
        })
        res.render('classement', {
            title: 'Manage Classement',
            games_not_started: results.games_not_started,
            games_started: results.games_started,
            rankmax: results.rankmax[0],
            games_ranked: games_ranked
        });
    });
};



exports.close_game_post = [
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a matiere object with escaped and trimmed data (and the old id!)
        var game = new Game({
            _id: req.body.gamenumber_started,
            started: true
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.


            // Get all authors and genres for form
            async.parallel({
                game: function (callback) {
                    Game.findById(req.body.gamenumber_started).exec(callback);
                },
            }, function (err, results) {
                if (err) {
                    return next(err);
                }
                res.render('classement', {
                    title: 'Update Game',
                    game: results.game,
                    errors: errors.array()
                });
            });

            return;
        } else {

            // Data from form is valid. Update the record.
            Game.findByIdAndUpdate(req.body.gamenumber_started, game, {
                returnOriginal: true
            }, function (err, thegame) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to matiere detail page.
                res.redirect('/users/classement');
            });
        }
    }
];



exports.set_final_score_post = [
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a matiere object with escaped and trimmed data (and the old id!)
        var game = new Game({
            _id: req.body.gamenumber_score,
            rteam1: req.body.put_final_rteam1,
            rteam2: req.body.put_final_rteam2,
            started: true
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.

            // Get all authors and genres for form
            async.parallel({
                game: function (callback) {
                    Game.findById(req.body.gamenumber_score).exec(callback);
                },
            }, function (err, results) {
                if (err) {
                    return next(err);
                }
                console
                res.render('classement', {
                    title: 'Update Game',
                    game: results.game,
                    errors: errors.array()
                });
            });

            return;
        } else {

            // Data from form is valid. Update the record.
            Game.findByIdAndUpdate(req.body.gamenumber_score, game, {
                returnOriginal: true
            }, function (err, thegame) {
                if (err) {
                    return next(err);
                }
                console.log(thegame)
                // Successful - redirect to matiere detail page.
                res.redirect('/users/classement');
            });
        }
    }

];


exports.update_score_post = [
    // Process request after validation and sanitization.
    (req, res, next) => {

        async.parallel({
            game: function (callback) {
                Game.findById(req.body.gamenumber_rank).exec(callback);
            },
        }, function (err, results) {
            if (err) {
                return next(err);
            }
            if (results.game.rteam1 != null && results.game.rteam2 != null) {
                var grteam1 = results.game.rteam1;
                var grteam2 = results.game.rteam2;

                var scenario = results.game.rteam1 - results.game.rteam2;

            }

            var max_points, middle_points, low_points = 0;
            var game_level = results.game.gametype;

            switch (game_level) {
                case 32:
                    max_points = 1000;
                    middle_points = 600;
                    low_points = 250;
                    break;
                case 16:
                    max_points = 1200;
                    middle_points = 800;
                    low_points = 300;
                    break;
                case 4:
                    max_points = 1500;
                    middle_points = 1000;
                    low_points = 500;
                    break;
                case 2:
                    max_points = 2000;
                    middle_points = 1500;
                    low_points = 600;
                    break;
                case 3:
                    max_points = 2500;
                    middle_points = 1800;
                    low_points = 800;
                    break;
                case 1:
                    max_points = 10000;
                    middle_points = 5000;
                    low_points = 1000;
            }

            User.find({}, function (err, users) {
                if (err){
                  return next(err);
                }
                users.forEach(function (theuser) {
                    if (theuser.userprono['prteam' + results.game.gamenumber + '1'] != null && theuser.userprono['prteam' + results.game.gamenumber + '1'] != 'undefined' && theuser.userprono['prteam' + results.game.gamenumber + '2'] != null && theuser.userprono['prteam' + results.game.gamenumber + '2'] != 'undefined') {
                        //console.log(theuser.userpseudo)
                        var uprteam1 = theuser.userprono['prteam' + results.game.gamenumber + '1'];
                        var uprteam2 = theuser.userprono['prteam' + results.game.gamenumber + '2'];
                        
                        var user_scenario = theuser.userprono['prteam' + results.game.gamenumber + '1'] - theuser.userprono['prteam' + results.game.gamenumber + '2'];
                        
                        //var mon_score_actuel = theuser.userscore;
                        // Match nul
                        if (scenario == 0 && user_scenario == 0) {
                            if (grteam1 == uprteam1 && grteam2 == uprteam2) {
                                // Bon score
                                theuser.userscore += max_points;
                                theuser.save();
                                //console.log('score exact: 1000 points')
                            } else {
                                // Bon résultat
                                theuser.userscore += middle_points;
                                theuser.save();
                                //console.log('résultat exact, score non-exact: 600 points')
                            }
                        }

                        if (scenario == 0 && user_scenario != 0) {
                            theuser.userscore += low_points;
                            theuser.save();
                        }

                        // team1 Vainqueur
                        if (scenario > 0 && user_scenario > 0) {
                            if (grteam1 == uprteam1 && grteam2 == uprteam2) {
                                // Bon score
                                theuser.userscore += max_points;
                                theuser.save();
                                //console.log('score exact: 1000 points')
                            } else {
                                // Bon résultat
                                theuser.userscore += middle_points;
                                theuser.save();
                                //console.log('résultat exact, score non-exact: 600 points')
                            }
                        }

                        // team2 Vainqueur
                        if (scenario < 0 && user_scenario < 0) {
                            if (grteam1 == uprteam1 && grteam2 == uprteam2) {
                                // Bon score
                                theuser.userscore += max_points;
                                theuser.save();
                                //console.log('score exact: 1000 points')
                            } else {
                                // Bon résultat
                                theuser.userscore += middle_points;
                                theuser.save();
                                //console.log('résultat exact, score non-exact: 600 points')
                            }
                        }

                        // Mauvais résultat
                        if (scenario > 0 && user_scenario <= 0) {

                            theuser.userscore += low_points;
                            theuser.save();
                            //console.log('résultat perdu: 250 points')
                        }
                        // Mauvais résultat
                        if (user_scenario >= 0 && scenario < 0) {
                            theuser.userscore += low_points;
                            theuser.save();
                            //console.log('résultat perdu: 250 points')
                        }

                        //console.log('user_scenario:' + user_scenario)
                    }
                    return
                });
            });

            res.redirect('/users/classement')
        });

        }
];

exports.create_classement_post = [
     // Process request after validation and sanitization.
    (req, res, next) => {

        // Create a new rank document object.
        var rank = new Rank({
            rankstate: [],
            rankaftergame: req.body.gamenumber_for_rank
        });

        async.parallel({
            users: function (callback) {
                User.find({}, {
                    _id: 1,
                    userpseudo: 1,
                    userscore: 1
                }).sort({
                    userscore: -1
                }).exec(callback);
            },
        }, function (err, results) {
            if (err) {
                return next(err);
            }
            var rang = 0;
            var points = '';

            results.users.forEach(function (theuser) {
                var newpoints = theuser.userscore;
                //var newrang = ;
                if (points != newpoints) {
                    rang++
                    points = newpoints;
                    rank.rankstate.push({
                        usrid: theuser._id,
                        usrpseudo: theuser.userpseudo,
                        usrscore: theuser.userscore,
                        usrrank: rang
                    });
                } else {
                    rank.rankstate.push({
                        usrid: theuser._id,
                        usrpseudo: theuser.userpseudo,
                        usrscore: theuser.userscore,
                        usrrank: rang
                    });
                }

            });


            rank.save();
            res.redirect('/users/classement')

        });
    }
];

exports.save_avatar_post = [
    (req, res, next) => {
        // Create a genre object with escaped and trimmed data.
        /*var user = new User({
            userphone: req.body.userphone,
            userpseudo: req.body.userpseudo,
            usermail: req.body.useremail,
            
        });*/
        // if(req.files) console.log('ok')
        // if(req.body.avatar) console.log('avatar ok')

        // Is there any file?
        if(!(req.file && req.file.buffer)) return next(new Error('No avatar to upload'));

        // Get file extension
        let fileExtension;
        
        if(req.file.mimetype === 'image/jpeg') fileExtension = '.jpg';
        else if (req.file.mimetype === 'image/png') fileExtension = '.png';
        else return next(new Error('Only JPEG and PNG are allowed.'))

        // Convert the buffer to base64 URI
        const datauri = new Datauri();
        datauri.format(fileExtension, req.file.buffer);
 
        // Upload to Cloudinary
        cloudinary.v2.uploader.upload(datauri.content, { folder: "avatars" }, (error, result) => {
            if(error || !result) return next(new Error('Failed to upload avatar'));
            User.findByIdAndUpdate({
                _id: req.user._id
            }, {
                $set: {
                    "userprofileimage" : result.secure_url
                }
            }, (err) => {
                if(err) return next(err);
                res.send(result);
            });
        }); 
    }
];
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy({
    usernameField: 'userpseudo',
    passwordField: 'userpassword'

}, function (username, password, done) {

    User.findOne({
            'userpseudo': username
        })
        .exec(function (err, found_user) {
            if (err) throw err; //{ return next(err); }
            if (!found_user) {
                return done(null, false, {
                    message: 'L\'utilisateur ' + username + ' est inconnu'
                });
            }
            // User found and compare password.
            found_user.comparePassword(password, found_user.userpassword, function (err, isMatch) {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, found_user);
                } else {
                    return done(null, false, {
                        message: 'Le mot de passe est invalide'
                    });
                }
            });
        })
}));

//
/*exports.reset_scores_post = [
     // Process request after validation and sanitization.
    (req, res, next) => {

        async.parallel({
            users: function (callback) {
                User.find({}, {
                    _id: 1,
                    userpseudo: 1,
                    userscore: 1
                }).exec(callback);
            },
        }, function (err, results) {
            if (err) {
                return next(err);
            }
      results.users.forEach(function (theuser) {
        
        theuser.userscore = 0;
        theuser.save();

      });
      return
    })
    }
];*/
