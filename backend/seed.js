require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Room = require('./models/Room');
const Fee = require('./models/Fee');
const Complaint = require('./models/Complaint');
const Notice = require('./models/Notice');
const Visitor = require('./models/Visitor');
const Mess = require('./models/Mess');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB, seeding...');

  // Clear
  await Promise.all([
    User.deleteMany(), Student.deleteMany(), Room.deleteMany(),
    Fee.deleteMany(), Complaint.deleteMany(), Notice.deleteMany(),
    Visitor.deleteMany(), Mess.deleteMany()
  ]);

  // ── ADMIN USER ──
  const adminUser = await User.create({
    username: 'admin', email: 'admin@residencex.com', password: 'admin123', role: 'admin'
  });

  // ── ROOMS ──
  const roomDefs = [
    ...Array.from({ length: 10 }, (_, i) => ({ number: `A${101 + i}`, block: 'Block A', floor: 1, type: 'Double', capacity: 2, monthlyRent: 12000 })),
    ...Array.from({ length: 10 }, (_, i) => ({ number: `A${201 + i}`, block: 'Block A', floor: 2, type: 'Double', capacity: 2, monthlyRent: 12000 })),
    ...Array.from({ length: 8 }, (_, i) => ({ number: `B${101 + i}`, block: 'Block B', floor: 1, type: 'Triple', capacity: 3, monthlyRent: 9000 })),
    ...Array.from({ length: 8 }, (_, i) => ({ number: `B${201 + i}`, block: 'Block B', floor: 2, type: 'Triple', capacity: 3, monthlyRent: 9000 })),
    ...Array.from({ length: 6 }, (_, i) => ({ number: `C${101 + i}`, block: 'Block C', floor: 1, type: 'Single', capacity: 1, monthlyRent: 18000 })),
    ...Array.from({ length: 6 }, (_, i) => ({ number: `C${201 + i}`, block: 'Block C', floor: 2, type: 'Single', capacity: 1, monthlyRent: 18000 })),
  ];
  const rooms = await Room.insertMany(roomDefs);

  // ── STUDENTS ──
  const studentData = [
    { studentId: 'STU2024001', name: 'Tushar K',    email: 'Tushar@residencex.com',    phone: '+91 98765 43210', course: 'B.Tech CSE', year: 3, rollNumber: '22BCS042', block: 'Block A', guardian: { name: 'Mr. Katkar', phone: '+91 87654 32109' }, address: 'PCMC', feeStatus: 'paid',    checkInDate: new Date('2022-08-01') },
    { studentId: 'STU2024002', name: 'Arjun Mehta',   email: 'arjun@residencex.com',    phone: '+91 97654 32109', course: 'B.Tech ECE', year: 2, rollNumber: '23BCE015', block: 'Block A', guardian: { name: 'Mr. Suresh Mehta',  phone: '+91 86543 21098' }, address: 'Delhi',            feeStatus: 'paid',    checkInDate: new Date('2023-08-01') },
    { studentId: 'STU2024003', name: 'Riya Sharma',   email: 'riya@residencex.com',     phone: '+91 96543 21098', course: 'B.Tech ME',  year: 1, rollNumber: '24BME030', block: 'Block A', guardian: { name: 'Mr. Rakesh Sharma', phone: '+91 85432 10987' }, address: 'Jaipur, Rajasthan', feeStatus: 'unpaid',  checkInDate: new Date('2024-08-01') },
    { studentId: 'STU2024004', name: 'Arjun Patel',   email: 'arjunp@residencex.com',   phone: '+91 95432 10987', course: 'MBA',        year: 1, rollNumber: '24MBA012', block: 'Block B', guardian: { name: 'Mr. Vijay Patel',  phone: '+91 84321 09876' }, address: 'Ahmedabad, Gujarat', feeStatus: 'partial', checkInDate: new Date('2024-07-15') },
    { studentId: 'STU2024005', name: 'Rohan Sharma',  email: 'rohan@residencex.com',    phone: '+91 94321 09876', course: 'B.Sc CS',    year: 2, rollNumber: '23BSC020', block: 'Block B', guardian: { name: 'Mrs. Pooja Sharma', phone: '+91 83210 98765' }, address: 'Mumbai, Maharashtra', feeStatus: 'paid',   checkInDate: new Date('2023-08-01') },
    { studentId: 'STU2024006', name: 'Kavya Nair',    email: 'kavya@residencex.com',    phone: '+91 93210 98765', course: 'B.Tech IT',  year: 4, rollNumber: '21BIT055', block: 'Block C', guardian: { name: 'Mr. Suresh Nair',  phone: '+91 82109 87654' }, address: 'Kochi, Kerala',    feeStatus: 'paid',    checkInDate: new Date('2021-08-01') },
    { studentId: 'STU2024007', name: 'Vikram Singh',  email: 'vikram@residencex.com',   phone: '+91 92109 87654', course: 'B.Tech CSE', year: 3, rollNumber: '22BCS078', block: 'Block A', guardian: { name: 'Mr. Harpal Singh', phone: '+91 81098 76543' }, address: 'Amritsar, Punjab', feeStatus: 'unpaid',  checkInDate: new Date('2022-08-01') },
    { studentId: 'STU2024008', name: 'Sneha Reddy',   email: 'sneha@residencex.com',    phone: '+91 91098 76543', course: 'B.Tech ECE', year: 2, rollNumber: '23BCE044', block: 'Block B', guardian: { name: 'Mr. Ramesh Reddy', phone: '+91 80987 65432' }, address: 'Hyderabad, Telangana', feeStatus: 'paid', checkInDate: new Date('2023-08-01') },
    { studentId: 'STU2024009', name: 'Ankit Gupta',   email: 'ankit@residencex.com',    phone: '+91 90987 65432', course: 'MCA',        year: 1, rollNumber: '24MCA008', block: 'Block C', guardian: { name: 'Mr. Manoj Gupta', phone: '+91 79876 54321' }, address: 'Lucknow, UP',      feeStatus: 'paid',    checkInDate: new Date('2024-07-20') },
    { studentId: 'STU2024010', name: 'Pooja Verma',   email: 'pooja@residencex.com',    phone: '+91 89876 54321', course: 'B.Sc Math',  year: 3, rollNumber: '22BSM019', block: 'Block A', guardian: { name: 'Mrs. Asha Verma',  phone: '+91 78765 43210' }, address: 'Varanasi, UP',     feeStatus: 'partial', checkInDate: new Date('2022-08-01') },
  ];

  const students = await Student.insertMany(studentData);

  // Allot rooms to students
  const allotments = [
    [0, 0], [1, 0], [2, 1], [3, 20], [4, 20], [5, 40], [6, 2], [7, 21], [8, 41], [9, 3]
  ];
  for (const [si, ri] of allotments) {
    const room = rooms[ri];
    room.occupants.push(students[si]._id);
    await room.save();
    students[si].room = room._id;
    await students[si].save();
  }

  // ── STUDENT USER (Priya Kaur) ──
  await User.create({
    username: 'student', email: 'priya@residencex.com', password: 'student123',
    role: 'student', studentRef: students[0]._id
  });

  // ── FEES ──
  const months = ['May 2024', 'June 2024', 'July 2024'];
  const feeRecords = [];
  for (const student of students) {
    for (const month of months) {
      const [m, y] = month.split(' ');
      const monthIndex = ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(m);
      const dueDate = new Date(parseInt(y), monthIndex, 5);
      const status = student.feeStatus === 'paid' ? 'paid' : student.feeStatus === 'partial' ? (month === 'July 2024' ? 'partial' : 'paid') : (month === 'July 2024' ? 'unpaid' : 'paid');
      const amount = 12000;
      feeRecords.push({ student: student._id, amount, month, dueDate, status, paidAmount: status === 'paid' ? amount : status === 'partial' ? 6000 : 0, paidDate: status === 'paid' ? dueDate : null });
    }
  }
  await Fee.insertMany(feeRecords);

  // ── COMPLAINTS ──
  await Complaint.create([
    { complaintId: 'C001', student: students[0]._id, title: 'Water leakage in bathroom', category: 'Plumbing',   priority: 'urgent', status: 'open',        description: 'There is water leaking from the overhead tank in bathroom.' },
    { complaintId: 'C002', student: students[1]._id, title: 'Faulty light switch',       category: 'Electrical', priority: 'medium', status: 'in-progress', description: 'The light switch in Room A102 trips frequently.' },
    { complaintId: 'C003', student: students[4]._id, title: 'Poor Wi-Fi signal',          category: 'Wi-Fi',      priority: 'low',    status: 'open',        description: 'Wi-Fi signal is very weak on the 2nd floor.' },
    { complaintId: 'C004', student: students[2]._id, title: 'Unhygienic washroom',        category: 'Cleanliness',priority: 'high',   status: 'resolved',    description: 'Washroom on floor 1 has not been cleaned for 3 days.', resolvedAt: new Date() },
    { complaintId: 'C005', student: students[0]._id, title: 'Food quality issue',         category: 'Mess Food',  priority: 'medium', status: 'resolved',    description: 'Dal was undercooked during dinner.', resolvedAt: new Date() },
  ]);

  // ── NOTICES ──
  await Notice.create([
    { title: 'Hostel Day Celebration 2024',      body: 'Annual hostel day will be celebrated on 20th July. All residents are requested to participate in cultural events.', type: 'general', postedBy: adminUser._id },
    { title: '⚠️ Water Supply Disruption',        body: 'Water supply will be disrupted on 17th July from 9 AM to 1 PM due to maintenance work. Please store water accordingly.', type: 'urgent', postedBy: adminUser._id },
    { title: 'Fee Payment Reminder',             body: 'Last date for July fee payment is 10th July. Students with pending dues will incur a late fine of ₹500 per week.', type: 'info', postedBy: adminUser._id },
    { title: 'New Mess Menu Effective Monday',   body: 'A new and improved mess menu will be effective from Monday. Feedback forms are available at the mess counter.', type: 'general', postedBy: adminUser._id },
  ]);

  // ── VISITORS ──
  await Visitor.create([
    { name: 'Mrs. Sunita Kaur',  relation: 'Mother',  phone: '+91 87654 32109', student: students[0]._id, inTime: new Date('2024-07-16T10:00:00'), outTime: new Date('2024-07-16T12:30:00'), status: 'out',    loggedBy: adminUser._id },
    { name: 'Mr. Ramesh Patel',  relation: 'Father',  phone: '+91 84321 09876', student: students[3]._id, inTime: new Date('2024-07-16T14:00:00'), status: 'inside', loggedBy: adminUser._id },
    { name: 'Ms. Neha Sharma',   relation: 'Sister',  phone: '+91 83210 98765', student: students[4]._id, inTime: new Date('2024-07-16T15:15:00'), status: 'inside', loggedBy: adminUser._id },
  ]);

  // ── MESS MENU ──
  await Mess.create([
    { day: 'Monday',    breakfast: 'Poha, Chai, Banana',                      lunch: 'Dal Tadka, Jeera Rice, Roti, Salad',           dinner: 'Paneer Butter Masala, Naan, Dal Makhani' },
    { day: 'Tuesday',   breakfast: 'Idli Sambar, Coconut Chutney',            lunch: 'Rajma, Steamed Rice, Roti, Raita',             dinner: 'Kadai Chicken / Aloo Gobi, Tandoori Roti' },
    { day: 'Wednesday', breakfast: 'Aloo Paratha, Curd, Pickle',              lunch: 'Chole, Bhature, Kachumber Salad',              dinner: 'Mix Veg Curry, Dal Fry, Steamed Rice, Roti' },
    { day: 'Thursday',  breakfast: 'Upma, Boiled Egg / Banana, Chai',        lunch: 'Dal Palak, Jeera Rice, Roti, Papad',           dinner: 'Egg Curry / Paneer Tikka Masala, Rice, Roti' },
    { day: 'Friday',    breakfast: 'Puri Bhaji, Chai',                        lunch: 'Sambar, Rasam, Steamed Rice, Poppadom',        dinner: 'Special Biryani (Veg/Non-Veg), Raita, Salad' },
    { day: 'Saturday',  breakfast: 'Bread Omelette / Sandwich, Cornflakes',  lunch: 'Dum Aloo, Pulao, Roti, Curd',                 dinner: 'Chicken Curry / Mushroom Masala, Roti, Rice' },
    { day: 'Sunday',    breakfast: 'Chole Bhature, Lassi',                   lunch: 'Special Sunday Thali — Dal, Sabzi, Rice, Roti, Dessert', dinner: 'Pasta / Chowmein, Soup, Garlic Bread' },
  ]);

  console.log('✅ Seed complete!');
  console.log('   Admin   → username: admin   | password: admin123');
  console.log('   Student → username: student | password: student123');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); mongoose.disconnect(); });
