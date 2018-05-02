/*var Team = require('../models/team');*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema({
    gamenumber:{type: Number, required:true},
    gametype:{type:Number, required:true},
    team1: {type: Schema.ObjectId, ref: 'Team', required: true},
    team2: {type: Schema.ObjectId, ref: 'Team', required: true},
    rteam1: {type: Number, default:0},
    rteam2: {type: Number, default:0},
    gamedate:{type: Date, required:true},
    gamestadium:{type: String, required:true},
    gameplace:{type: String, required:true},
    started: {type: Boolean, default: false, required: true}
});


// Virtual for this genre instance URL.
GameSchema
.virtual('urlupdate')
.get(function () {
  return '/game/' + this.id +'/update';
});


/*module.exports.getGameByGameNumber = function(gamenumber, callback){
    var query = {'gamenumber':gamenumber};
    Game.findOne(query, callback);
};*/

// Export model.
module.exports = mongoose.model('Game', GameSchema);
