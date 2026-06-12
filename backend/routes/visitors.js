const router = require('express').Router();
const Visitor = require('../models/Visitor');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'student') filter.student = req.user.studentId;
    const visitors = await Visitor.find(filter).populate('student', 'name room').sort({ inTime: -1 });
    res.json(visitors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const visitor = await Visitor.create({ ...req.body, loggedBy: req.user.id });
    res.status(201).json(visitor);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id/checkout', auth, role('admin'), async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: 'out', outTime: new Date() },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Visitor log deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
