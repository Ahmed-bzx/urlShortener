const mongoose = require('mongoose');

const linkSchema = mongoose.Schema({
  originalUrl: String,
  shortId: String,
});

const Link = module.exports = mongoose.model('Link', linkSchema);

// Get One Link
module.exports.getLink = function (query, callback) {
  Link.findOne(query, callback);
};

// Add Link
module.exports.addLink = function (link, callback) {
  Link.create(link, callback);
};
