const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  role: {
    type: String,
    required: [true, 'Please add a role']
  },
  status: {
    type: String,
    required: true,
    enum: ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
    default: 'Wishlist'
  },
  deadline: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
