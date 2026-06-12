const router = require('express').Router();
const Mess = require('../models/Mess');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, async (req, res) => {
  try {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const menu = await Mess.find().sort({ _id: 1 });
    // Sort by weekday order
    menu.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
    res.json(menu);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, role('admin'), async (req, res) => {
  try {
    const mess = await Mess.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mess) return res.status(404).json({ message: 'Menu item not found' });
    res.json(mess);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
