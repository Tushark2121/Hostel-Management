const router = require('express').Router();
const Student = require('../models/Student');
const Room = require('../models/Room');
const Fee = require('../models/Fee');
const Complaint = require('../models/Complaint');
const Visitor = require('../models/Visitor');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/stats', auth, role('admin'), async (req, res) => {
  try {
    const [totalStudents, totalRooms, complaints, fees, visitors] = await Promise.all([
      Student.countDocuments({ status: 'active' }),
      Room.find(),
      Complaint.find(),
      Fee.find(),
      Visitor.find({ status: 'inside' })
    ]);

    const occupiedRooms = totalRooms.filter(r => r.status !== 'available').length;
    const openComplaints = complaints.filter(c => c.status === 'open').length;
    const urgentComplaints = complaints.filter(c => c.status === 'open' && c.priority === 'urgent').length;
    const pendingFees = fees.filter(f => f.status !== 'paid').reduce((s, f) => s + (f.amount - f.paidAmount), 0);
    const defaulterCount = await Student.countDocuments({ feeStatus: { $in: ['unpaid','partial'] } });

    // Block occupancy
    const blocks = ['Block A', 'Block B', 'Block C'];
    const blockOccupancy = await Promise.all(blocks.map(async block => {
      const blockRooms = totalRooms.filter(r => r.block === block);
      const totalCap = blockRooms.reduce((s, r) => s + r.capacity, 0);
      const occupied = blockRooms.reduce((s, r) => s + r.occupants.length, 0);
      return { block, percent: totalCap ? Math.round((occupied / totalCap) * 100) : 0 };
    }));

    res.json({
      totalStudents,
      occupiedRooms,
      totalRooms: totalRooms.length,
      openComplaints,
      urgentComplaints,
      pendingFees,
      defaulterCount,
      visitorsInside: visitors.length,
      blockOccupancy
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
