const router = require('express').Router();
const Room = require('../models/Room');
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET /api/rooms
router.get('/', auth, async (req, res) => {
  try {
    const { block, status } = req.query;
    const filter = {};
    if (block) filter.block = block;
    if (status) filter.status = status;
    const rooms = await Room.find(filter).populate('occupants', 'name studentId');
    res.json(rooms);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/rooms/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('occupants', 'name studentId phone');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/rooms (admin)
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/rooms/:id (admin)
router.put('/:id', auth, role('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// POST /api/rooms/:id/allot — allot student to room (admin)
router.post('/:id/allot', auth, role('admin'), async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.occupants.length >= room.capacity)
      return res.status(400).json({ message: 'Room is full' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Remove from previous room
    if (student.room) {
      await Room.findByIdAndUpdate(student.room, { $pull: { occupants: student._id } });
    }

    room.occupants.push(student._id);
    await room.save();

    student.room = room._id;
    student.block = room.block;
    await student.save();

    res.json({ message: 'Room allotted successfully', room });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/rooms/:id/vacate — remove student from room (admin)
router.post('/:id/vacate', auth, role('admin'), async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $pull: { occupants: studentId } },
      { new: true }
    );
    await Student.findByIdAndUpdate(studentId, { $unset: { room: 1 } });
    res.json({ message: 'Student vacated', room });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/rooms/:id (admin)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
