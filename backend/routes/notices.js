const router = require('express').Router();
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, async (req, res) => {
  try {
    const notices = await Notice.find().populate('postedBy', 'username').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(notice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', auth, role('admin'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
