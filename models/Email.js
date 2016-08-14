
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
	create_date:{
		type: Date,
		default: Date.now
	},
  email : String,
  followup : {type: Boolean, default: false},
}, { timestamps: true });
const Email = mongoose.model('Email', emailSchema);
module.exports = Email;
