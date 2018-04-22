
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GroupeSchema = new Schema({
    name:{type: String, required:true, unique:true},
    useradmin:{type: Schema.Types.ObjectId, ref: 'User' },
    users : [{ type: Schema.Types.ObjectId, ref: 'User' }]
});


// Virtual for this genre instance URL.
/*CourseSchema
.virtual('url')
.get(function () {
  return '/admin/course/'+this._id;
});*/



// Export model.
module.exports = mongoose.model('Groupe', GroupeSchema);