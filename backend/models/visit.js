const mongoose = require('mongoose');

const visitSchema = mongoose.Schema({
  customer: { type:String, required:true},
  contact_no: { type:String, required:true},
  remarks: { type:String},
  date: { type:Date, default:Date.now},
  lat: {type:String, required:true},
  lng: {type:String, required:true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creator_name: {type:String, required:true}
});


module.exports = mongoose.model('Visit', visitSchema);
