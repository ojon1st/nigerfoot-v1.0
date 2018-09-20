var Counter = require('../models/counter');
var Pronostic = require('../models/pronostic');
var Groupe = require('../models/groupe');
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
var SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    username: {type: String},
    userphone: {type: Number, required: true, unique: true},
    userpseudo: {type: String, unique:true, required: true},
    userpassword: {type: String},
    usermail: {type: String, unique:true},
    userprofileimage:{type: String, default:'' },
    userid: {type: Number},
    joinedGroups:[{type: Schema.ObjectId, ref: 'Groupe'}],
    userscore:{type: Number, default:0},
    userprono:
        { prteam11:{type:Number}, 
          prteam12:{type:Number},
          prteam21:{type:Number},
          prteam22:{type:Number},
          prteam31:{type:Number},
          prteam32:{type:Number},
          prteam41:{type:Number},
          prteam42:{type:Number},
          prteam51:{type:Number},
          prteam52:{type:Number},
          prteam61:{type:Number},
          prteam62:{type:Number},
          prteam71:{type:Number},
          prteam72:{type:Number},
          prteam81:{type:Number},
          prteam82:{type:Number}}
    
});

UserSchema.pre('save', function(next){
    
    var doc = this;
    
    Counter.findOneAndUpdate(
        { _id: 'userid' },
        { $inc : { sequence_value : 1 } },
        { new : true },  
        function(err, seq){
            if(err) return next(err);
            doc.userid = seq.sequence_value;
            next();
        }
    );    
 });

UserSchema.pre('save', function(next){
    var doc = this;
    // only hash the password if it has been modified (or is new)
    if (!doc.isModified('userpassword')){
        return next();
    } else{
        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);

            // hash the password using our new salt
            bcrypt.hash(doc.userpassword, salt, function(err, hash) {
                if (err) return next(err);

                // override the cleartext password with the hashed one
                doc.userpassword = hash;
                next();
            });
        });
    }
});

// Virtual for this genre instance URL.
UserSchema
.virtual('url')
.get(function () {
  return '/';
});

//UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.comparePassword = function(candidatePassword, hash, cb) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        //if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
