<<<<<<< HEAD
var User = require('../models/user');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RankSchema = new Schema({
    rankstate: [{usrid:{type: Schema.ObjectId},
                 usrpseudo:{type: String},
                 usrscore:{type:Number, default:0},
                 usrrank:{type:Number}}],
    rankaftergame:{type: Number,required: true}
});

// Export model.
=======
var User = require('../models/user');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RankSchema = new Schema({
    rankstate: [{usrid:{type: Schema.ObjectId},
                 usrpseudo:{type: String},
                 usrscore:{type:Number, default:0},
                 usrrank:{type:String}}],
    rankaftergame:{type: Number,required: true}
});

// Export model.
>>>>>>> f58f6240db6c0608ecfc6abf65399674ea7c200f
module.exports = mongoose.model('Rank', RankSchema);