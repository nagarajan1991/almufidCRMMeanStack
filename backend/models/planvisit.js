const mongoose = require('mongoose');

const planVisitSchema = mongoose.Schema({
  userId: { type: String, required: true },
  creator_name: { type: String, required: true },
  title: { type: String, required: true },
  start: { type: Date, default: Date.now },
  end: { type: Date, default: Date.now },
  pcolor: { type: String, required: true },
  scolor: { type: String, required: true },
  draggable: { type: Boolean, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  /*  resizable: {
     beforeStart: {type:String, required:true},
     afterEnd: {type:String, required:true},
   }, */
});

module.exports = mongoose.model('PlanVisit', planVisitSchema);
