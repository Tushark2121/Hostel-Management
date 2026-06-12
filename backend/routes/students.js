const router = require('express').Router();
const Student = require('../models/Student');
const User = require('../models/User');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET /api/students — list all (admin)
router.get('/', auth, role('admin'), async (req, res) => {
  try {
    const { search, block, feeStatus } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
    if (block) filter.block = block;
    if (feeStatus) filter.feeStatus = feeStatus;
    const students = await Student.find(filter).populate('room', 'number block');
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/students/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('room');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/students — create (admin)
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const { username, password, ...studentData } = req.body;

    // Auto-generate studentId
    const count = await Student.countDocuments();
    studentData.studentId = studentData.studentId || `STU${new Date().getFullYear()}${String(count + 1).padStart(3, '0')}`;

    const student = await Student.create(studentData);

    // Create user account for student
    if (username && password) {
      await User.create({
        username,
        email: studentData.email,
        password,
        role: 'student',
        studentRef: student._id
      });
    }

    res.status(201).json(student);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/students/:id — update
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/students/:id
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Remove from room occupants
    if (student.room) {
      await Room.findByIdAndUpdate(student.room, { $pull: { occupants: student._id } });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
