const router = require('express').Router();
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET /api/fees (admin)
router.get('/', auth, role('admin'), async (req, res) => {
  try {
    const { status, month } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (month) filter.month = month;
    const fees = await Fee.find(filter).populate('student', 'name studentId room block').sort({ dueDate: -1 });
    res.json(fees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/fees/student/:studentId — fees for a specific student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId }).sort({ dueDate: -1 });
    res.json(fees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/fees (admin) — create fee record
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/fees/:id — update (mark paid etc)
router.put('/:id', auth, role('admin'), async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    // Sync student feeStatus
    const allFees = await Fee.find({ student: fee.student });
    let feeStatus = 'paid';
    if (allFees.some(f => f.status === 'unpaid' || f.status === 'overdue')) feeStatus = 'unpaid';
    else if (allFees.some(f => f.status === 'partial')) feeStatus = 'partial';
    await Student.findByIdAndUpdate(fee.student, { feeStatus });

    res.json(fee);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// POST /api/fees/:id/pay — collect payment
router.post('/:id/pay', auth, role('admin'), async (req, res) => {
  try {
    const { amount } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });

    fee.paidAmount += amount;
    if (fee.paidAmount >= fee.amount) {
      fee.status = 'paid';
      fee.paidDate = new Date();
    } else {
      fee.status = 'partial';
    }
    await fee.save();
    res.json(fee);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/fees/summary — dashboard summary
router.get('/summary/stats', auth, role('admin'), async (req, res) => {
  try {
    const fees = await Fee.find();
    const totalCollected = fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.paidAmount, 0);
    const totalPending = fees.filter(f => f.status !== 'paid').reduce((s, f) => s + (f.amount - f.paidAmount), 0);
    const defaulters = await Student.countDocuments({ feeStatus: { $in: ['unpaid', 'partial'] } });
    res.json({ totalCollected, totalPending, defaulters });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
