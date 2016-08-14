
const mongoose = require('mongoose');

const wishTypeSchema = new mongoose.Schema({
  wishId: { type: String, unique: true },
  updated_at : Date,
  fulfilled : Boolean,
  delivered : Boolean,
}, { timestamps: true });

module.exports = Wish;
