const Application = require('../models/Application');

// @desc    Get applications
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort('order');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
  try {
    const { company, role, status, deadline, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: 'Please add company and role fields' });
    }

    const application = await Application.create({
      company,
      role,
      status: status || 'Wishlist',
      deadline,
      notes,
      user: req.user.id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check for user
    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check for user
    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await application.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (drag and drop)
// @route   PUT /api/applications/:id/status
// @access  Private
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, order } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    application.status = status || application.status;
    if (order !== undefined) application.order = order;
    
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus
};
