/*var Rencontre = require('../models/rencontre');*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PronosticSchema = new Schema({
    game: {type: Schema.ObjectId, ref: 'Game', required: true},
    prteam1: {type: Number, default:0},
    prteam2: {type: Number, default:0}
});


// Virtual for this genre instance URL.
/*CourseSchema
.virtual('url')
.get(function () {
  return '/admin/course/'+this._id;
});*/


// Export model.
module.exports = mongoose.model('Pronostic', PronosticSchema);
