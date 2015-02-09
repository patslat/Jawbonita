var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId;

var userSchema = new Schema({
    name  : String // App's identifier, use first, last for human name
  , token : String
  , first : String
  , last  : String
  , height: String
  , weight: String
  , image : String
  , gender: String
});

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
};
