var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var TeamSchema = new Schema({
    teamname: {type: String, required: true},
    teamgroup: {type: String, required: true},
    teampoints: {type: Number, default:0},
    treamrang: {type: Number, default: ''}
});


// Virtual for this team instance name.
/*MatiereSchema
.virtual('name')
.get(function () {
  return this.name;
});*/


// Export model.
module.exports = mongoose.model('Team', TeamSchema);