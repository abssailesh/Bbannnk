const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pending' },  // Pending, In Progress, Resolved
  resolution: String,  // Vendor's resolution, if any
  createdAt: { type: Date, default: Date.now },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
