const mangoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mangoose.Schema({
  fullname: { type:String, required:true},
  email: { type:String, required:true, unique: true},
  password: { type:String, required:true},
  userrolevalue: { type:String, required:true},
  mobile: { type:String, required:true},
});

userSchema.plugin(uniqueValidator);

module.exports = mangoose.model('User', userSchema);
