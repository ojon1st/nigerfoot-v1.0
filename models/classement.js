var Counter = require('../models/counter');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    matiere: {type: Schema.ObjectId, ref: 'Matiere', required: true},
    sous_matiere: {type: Schema.ObjectId, ref: 'Sous_Matiere', required: true},
    chapitre: {type: Schema.ObjectId, ref: 'Chapitre', required: true},
    classe: {type: Schema.ObjectId, ref: 'Classe', required: true},
    coursecode: {type: String},
    coursecontent: {type: String, required: true},
    courseprof: {type: String, default: 'Admin'},
    coursestatut: {type: Boolean, default: false}
});

CourseSchema.pre('save', function(next){
    var doc = this;
    Counter.findOneAndUpdate(
        { _id: 'coursid' },
        { $inc : { sequence_value : 1 } },
        { new : true },  
        function(err, seq){
            if(err) return next(err);
            doc.coursecode = 'CR' + seq.sequence_value;
            next();
        }
    );
 });

// Virtual for this genre instance URL.
CourseSchema
.virtual('url')
.get(function () {
  return '/admin/course/'+this._id;
});



// Export model.
module.exports = mongoose.model('Course', CourseSchema);
