
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
	owner: { type: String, required:true},
	ownerName: { type: String },
	title: { type: String, required:true },
	category: { type: String, default:'News' },
	body: String,
	tags: Array,
	is_public: {type:Boolean, default:true},
	type: {type: String, default: 'post'},
	updated_at : Date,
	create_date:{
		type: Date,
		default: Date.now
	}
}, { timestamps: true });



const News = mongoose.model('News', newsSchema);
module.exports = News;
