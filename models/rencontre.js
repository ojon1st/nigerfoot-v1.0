/*var Team = require('../models/team');*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RencontreSchema = new Schema({
    team1: {type: Schema.ObjectId, ref: 'Team', required: true},
    team2: {type: Schema.ObjectId, ref: 'Team', required: true},
    resultat: {
            rteam1: {type: Number, default:0},
            rteam2: {type: Number, default:0},
           },
    gamedate:{type: Date, required:true},
    gamehour:{type},
    gamestadium:{type: String, required:true},
    gameplace:{type: String, required:true}/*,
    scorevalue: {type: Number, default: '', required: true}*/
});


// Virtual for this genre instance URL.
/*CourseSchema
.virtual('url')
.get(function () {
  return '/admin/course/'+this._id;
});*/



// Export model.
module.exports = mongoose.model('Rencontre', RencontreSchema);
