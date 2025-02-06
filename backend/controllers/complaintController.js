const Complaint = require('../models/complaint');
const sendEmail = require('../utils/email');

// Create a complaint
exports.createComplaint = async (req, res) => {
  const { customerId, description } = req.body;
  try {
    const complaint = new Complaint({
      vendorId: req.vendorId,  // Assuming vendor ID is passed through middleware
      customerId,
      description,
    });
    await complaint.save();
    res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to a complaint

exports.respondToComplaint = async (req, res) => {
    const { complaintId, resolution } = req.body;
    try {
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) return res.status(400).json({ message: 'Complaint not found' });
  
      complaint.status = 'In Progress';
      complaint.resolution = resolution;
      await complaint.save();
  
      // Send email to vendor
      sendEmail(
        'vendor@example.com',  // Replace with vendor's email
        'New Complaint Response',
        `A new complaint has been updated with the resolution: ${resolution}`
      );
  
      res.json({ message: 'Complaint updated successfully', complaint });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

