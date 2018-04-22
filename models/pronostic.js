/*var Rencontre = require('../models/rencontre');*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PronosticSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User', required: true},
    rencontre: {type: Schema.ObjectId, ref: 'Rencontre', required: true},
    scorepronostic: {
            prteam1: {type: Number, default:0},
            prteam2: {type: Number, default:0},
           },
    points: {type: Number}
});


// Virtual for this genre instance URL.
/*CourseSchema
.virtual('url')
.get(function () {
  return '/admin/course/'+this._id;
});*/



// Export model.
module.exports = mongoose.model('Pronostic', PronosticSchema);
