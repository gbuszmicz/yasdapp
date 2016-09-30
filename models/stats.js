/**
 * Just for stats:
 *
 * - file count by country
 *
 */
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  fileCount : { type: Number, required: false },  // File count
  city      : { type: String, required: false },  // Rosario 
  country   : { type: String, required: false },  // AR
  region    : { type: String, required: false }  // Santa Fe
});

schema.set('autoIndex', false);
module.exports = Stat = mongoose.model('Stat', schema);
