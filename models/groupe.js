var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../models/user');

var GroupeSchema = new Schema({
    groupname: {type:String, required:true},
    createdBy: {type: Schema.ObjectId, ref: 'User', required: true},
    joinedUsers:[{type: Schema.ObjectId, ref: 'User'}]
});


// Export model.
module.exports = mongoose.model('Groupe', GroupeSchema);