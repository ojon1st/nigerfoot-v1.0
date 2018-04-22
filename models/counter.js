var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CounterSchema = new Schema({
    _id: {type: String, required: true},
    sequence_value: {type: Number, default: 0}
});


CounterSchema.statics.increment = function (counter, callback) {
    return this.findByIdAndUpdate(counter, { $inc: { sequence_value: 1 } }, {new: true, upsert: true, select: {sequence_value: 1}}, callback);
};


// Export model.
module.exports = mongoose.model('Counter', CounterSchema);
