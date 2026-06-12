const router = require('express').Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET /api/complaints (admin sees all; student sees own)
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'student') filter.student = req.user.studentId;
    const { status, category } = req.query;
    if (status) filter.status = status;
    if (category) filter.category = category;
    const complaints = await Complaint.find(filter)
      .populate('student', 'name studentId room')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/complaints/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('student', 'name studentId');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/complaints (student submits)
router.post('/', auth, async (req, res) => {
  try {
    const data = {
      ...req.body,
      student: req.user.role === 'student' ? req.user.studentId : req.body.student
    };
    const complaint = await Complaint.create(data);
    res.status(201).json(complaint);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/complaints/:id — update status (admin)
router.put('/:id', auth, role('admin'), async (req, res) => {
  try {
    if (req.body.status === 'resolved') {
      req.body.resolvedAt = new Date();
      req.body.resolvedBy = req.user.id;
    }
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/complaints/:id (admin)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
