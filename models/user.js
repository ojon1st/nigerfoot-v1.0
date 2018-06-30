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
          prteam82:{type:Number},
          prteam91:{type:Number},
          prteam92:{type:Number},
          prteam101:{type:Number},
          prteam102:{type:Number},
          prteam111:{type:Number},
          prteam112:{type:Number},
          prteam121:{type:Number},
          prteam122:{type:Number},
          prteam131:{type:Number},
          prteam132:{type:Number},
          prteam141:{type:Number},
          prteam142:{type:Number},
          prteam151:{type:Number},
          prteam152:{type:Number},
          prteam161:{type:Number},
          prteam162:{type:Number},
          prteam171:{type:Number},
          prteam172:{type:Number},
          prteam181:{type:Number},
          prteam182:{type:Number},
          prteam191:{type:Number},
          prteam192:{type:Number},
          prteam201:{type:Number},
          prteam202:{type:Number},
          prteam211:{type:Number},
          prteam212:{type:Number},
          prteam221:{type:Number},
          prteam222:{type:Number},
          prteam231:{type:Number},
          prteam232:{type:Number},
          prteam241:{type:Number},
          prteam242:{type:Number},
          prteam251:{type:Number},
          prteam252:{type:Number},
          prteam261:{type:Number},
          prteam262:{type:Number},
          prteam271:{type:Number},
          prteam272:{type:Number},
          prteam281:{type:Number},
          prteam282:{type:Number},
          prteam291:{type:Number},
          prteam292:{type:Number},
          prteam301:{type:Number},
          prteam302:{type:Number},
          prteam311:{type:Number},
          prteam312:{type:Number},
          prteam321:{type:Number},
          prteam322:{type:Number},
          prteam331:{type:Number},
          prteam332:{type:Number},
          prteam341:{type:Number},
          prteam342:{type:Number},
          prteam351:{type:Number},
          prteam352:{type:Number},
          prteam361:{type:Number},
          prteam362:{type:Number},
          prteam371:{type:Number},
          prteam372:{type:Number},
          prteam381:{type:Number},
          prteam382:{type:Number},
          prteam391:{type:Number},
          prteam392:{type:Number},
          prteam401:{type:Number},
          prteam402:{type:Number},
          prteam411:{type:Number},
          prteam412:{type:Number},
          prteam421:{type:Number},
          prteam422:{type:Number},
          prteam431:{type:Number},
          prteam432:{type:Number},
          prteam441:{type:Number},
          prteam442:{type:Number},
          prteam451:{type:Number},
          prteam452:{type:Number},
          prteam461:{type:Number},
          prteam462:{type:Number},
          prteam471:{type:Number},
          prteam472:{type:Number},
          prteam481:{type:Number},
          prteam482:{type:Number},
          prteam491:{type:Number},
          prteam492:{type:Number},
          prteam501:{type:Number},
          prteam502:{type:Number},
          prteam511:{type:Number},
          prteam512:{type:Number},
          prteam521:{type:Number},
          prteam522:{type:Number},
          prteam531:{type:Number},
          prteam532:{type:Number},
          prteam541:{type:Number},
          prteam542:{type:Number},
          prteam551:{type:Number},
          prteam552:{type:Number},
          prteam561:{type:Number},
          prteam562:{type:Number}}
    
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
