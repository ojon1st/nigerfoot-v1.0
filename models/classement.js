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
module.exports = mongoose.model('Rank', RankSchema);