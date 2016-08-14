
const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
	owner: { type: String, required:true},
	ownerName: { type: String },
	title: { type: String, required:true },
	description: String,
	tags: Array,
	notes: String,
	UPC: String,
	URL: String,
	imageURL: String,
	quantity: Number,
	urgency: String,
	is_public: {type:Boolean, default:true},
	type: String,
	for_class: Array,
	for_grade: Array,
	updated_at : Date,
	needed_before: Date,
	fulfilled : { type: Boolean, default: false},
	fulfilled_date: Date,
	delivered : { type: Boolean, default: false},
	delivered_date: Date,
	create_date:{
		type: Date,
		default: Date.now
	}
}, { timestamps: true });



const Wish = mongoose.model('Wish', wishSchema);
module.exports = Wish;
