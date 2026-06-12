"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

require('dotenv').config();

var mongoose = require('mongoose');

var User = require('./models/User');

var Student = require('./models/Student');

var Room = require('./models/Room');

var Fee = require('./models/Fee');

var Complaint = require('./models/Complaint');

var Notice = require('./models/Notice');

var Visitor = require('./models/Visitor');

var Mess = require('./models/Mess');

function seed() {
  var adminUser, roomDefs, rooms, studentData, students, allotments, _i, _allotments, _allotments$_i, si, ri, room, months, feeRecords, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, student, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, month, _month$split, _month$split2, m, y, monthIndex, dueDate, status, amount;

  return regeneratorRuntime.async(function seed$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.MONGODB_URI));

        case 2:
          console.log('Connected to MongoDB, seeding...'); // Clear

          _context.next = 5;
          return regeneratorRuntime.awrap(Promise.all([User.deleteMany(), Student.deleteMany(), Room.deleteMany(), Fee.deleteMany(), Complaint.deleteMany(), Notice.deleteMany(), Visitor.deleteMany(), Mess.deleteMany()]));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(User.create({
            username: 'admin',
            email: 'admin@residencex.com',
            password: 'admin123',
            role: 'admin'
          }));

        case 7:
          adminUser = _context.sent;
          // ── ROOMS ──
          roomDefs = [].concat(_toConsumableArray(Array.from({
            length: 10
          }, function (_, i) {
            return {
              number: "A".concat(101 + i),
              block: 'Block A',
              floor: 1,
              type: 'Double',
              capacity: 2,
              monthlyRent: 12000
            };
          })), _toConsumableArray(Array.from({
            length: 10
          }, function (_, i) {
            return {
              number: "A".concat(201 + i),
              block: 'Block A',
              floor: 2,
              type: 'Double',
              capacity: 2,
              monthlyRent: 12000
            };
          })), _toConsumableArray(Array.from({
            length: 8
          }, function (_, i) {
            return {
              number: "B".concat(101 + i),
              block: 'Block B',
              floor: 1,
              type: 'Triple',
              capacity: 3,
              monthlyRent: 9000
            };
          })), _toConsumableArray(Array.from({
            length: 8
          }, function (_, i) {
            return {
              number: "B".concat(201 + i),
              block: 'Block B',
              floor: 2,
              type: 'Triple',
              capacity: 3,
              monthlyRent: 9000
            };
          })), _toConsumableArray(Array.from({
            length: 6
          }, function (_, i) {
            return {
              number: "C".concat(101 + i),
              block: 'Block C',
              floor: 1,
              type: 'Single',
              capacity: 1,
              monthlyRent: 18000
            };
          })), _toConsumableArray(Array.from({
            length: 6
          }, function (_, i) {
            return {
              number: "C".concat(201 + i),
              block: 'Block C',
              floor: 2,
              type: 'Single',
              capacity: 1,
              monthlyRent: 18000
            };
          })));
          _context.next = 11;
          return regeneratorRuntime.awrap(Room.insertMany(roomDefs));

        case 11:
          rooms = _context.sent;
          // ── STUDENTS ──
          studentData = [{
            studentId: 'STU2024001',
            name: 'Tushar K',
            email: 'Tushar@residencex.com',
            phone: '+91 98765 43210',
            course: 'B.Tech CSE',
            year: 3,
            rollNumber: '22BCS042',
            block: 'Block A',
            guardian: {
              name: 'Mr. Katkar',
              phone: '+91 87654 32109'
            },
            address: 'PCMC',
            feeStatus: 'paid',
            checkInDate: new Date('2022-08-01')
          }, {
            studentId: 'STU2024002',
            name: 'Arjun Mehta',
            email: 'arjun@residencex.com',
            phone: '+91 97654 32109',
            course: 'B.Tech ECE',
            year: 2,
            rollNumber: '23BCE015',
            block: 'Block A',
            guardian: {
              name: 'Mr. Suresh Mehta',
              phone: '+91 86543 21098'
            },
            address: 'Delhi',
            feeStatus: 'paid',
            checkInDate: new Date('2023-08-01')
          }, {
            studentId: 'STU2024003',
            name: 'Riya Sharma',
            email: 'riya@residencex.com',
            phone: '+91 96543 21098',
            course: 'B.Tech ME',
            year: 1,
            rollNumber: '24BME030',
            block: 'Block A',
            guardian: {
              name: 'Mr. Rakesh Sharma',
              phone: '+91 85432 10987'
            },
            address: 'Jaipur, Rajasthan',
            feeStatus: 'unpaid',
            checkInDate: new Date('2024-08-01')
          }, {
            studentId: 'STU2024004',
            name: 'Arjun Patel',
            email: 'arjunp@residencex.com',
            phone: '+91 95432 10987',
            course: 'MBA',
            year: 1,
            rollNumber: '24MBA012',
            block: 'Block B',
            guardian: {
              name: 'Mr. Vijay Patel',
              phone: '+91 84321 09876'
            },
            address: 'Ahmedabad, Gujarat',
            feeStatus: 'partial',
            checkInDate: new Date('2024-07-15')
          }, {
            studentId: 'STU2024005',
            name: 'Rohan Sharma',
            email: 'rohan@residencex.com',
            phone: '+91 94321 09876',
            course: 'B.Sc CS',
            year: 2,
            rollNumber: '23BSC020',
            block: 'Block B',
            guardian: {
              name: 'Mrs. Pooja Sharma',
              phone: '+91 83210 98765'
            },
            address: 'Mumbai, Maharashtra',
            feeStatus: 'paid',
            checkInDate: new Date('2023-08-01')
          }, {
            studentId: 'STU2024006',
            name: 'Kavya Nair',
            email: 'kavya@residencex.com',
            phone: '+91 93210 98765',
            course: 'B.Tech IT',
            year: 4,
            rollNumber: '21BIT055',
            block: 'Block C',
            guardian: {
              name: 'Mr. Suresh Nair',
              phone: '+91 82109 87654'
            },
            address: 'Kochi, Kerala',
            feeStatus: 'paid',
            checkInDate: new Date('2021-08-01')
          }, {
            studentId: 'STU2024007',
            name: 'Vikram Singh',
            email: 'vikram@residencex.com',
            phone: '+91 92109 87654',
            course: 'B.Tech CSE',
            year: 3,
            rollNumber: '22BCS078',
            block: 'Block A',
            guardian: {
              name: 'Mr. Harpal Singh',
              phone: '+91 81098 76543'
            },
            address: 'Amritsar, Punjab',
            feeStatus: 'unpaid',
            checkInDate: new Date('2022-08-01')
          }, {
            studentId: 'STU2024008',
            name: 'Sneha Reddy',
            email: 'sneha@residencex.com',
            phone: '+91 91098 76543',
            course: 'B.Tech ECE',
            year: 2,
            rollNumber: '23BCE044',
            block: 'Block B',
            guardian: {
              name: 'Mr. Ramesh Reddy',
              phone: '+91 80987 65432'
            },
            address: 'Hyderabad, Telangana',
            feeStatus: 'paid',
            checkInDate: new Date('2023-08-01')
          }, {
            studentId: 'STU2024009',
            name: 'Ankit Gupta',
            email: 'ankit@residencex.com',
            phone: '+91 90987 65432',
            course: 'MCA',
            year: 1,
            rollNumber: '24MCA008',
            block: 'Block C',
            guardian: {
              name: 'Mr. Manoj Gupta',
              phone: '+91 79876 54321'
            },
            address: 'Lucknow, UP',
            feeStatus: 'paid',
            checkInDate: new Date('2024-07-20')
          }, {
            studentId: 'STU2024010',
            name: 'Pooja Verma',
            email: 'pooja@residencex.com',
            phone: '+91 89876 54321',
            course: 'B.Sc Math',
            year: 3,
            rollNumber: '22BSM019',
            block: 'Block A',
            guardian: {
              name: 'Mrs. Asha Verma',
              phone: '+91 78765 43210'
            },
            address: 'Varanasi, UP',
            feeStatus: 'partial',
            checkInDate: new Date('2022-08-01')
          }];
          _context.next = 15;
          return regeneratorRuntime.awrap(Student.insertMany(studentData));

        case 15:
          students = _context.sent;
          // Allot rooms to students
          allotments = [[0, 0], [1, 0], [2, 1], [3, 20], [4, 20], [5, 40], [6, 2], [7, 21], [8, 41], [9, 3]];
          _i = 0, _allotments = allotments;

        case 18:
          if (!(_i < _allotments.length)) {
            _context.next = 30;
            break;
          }

          _allotments$_i = _slicedToArray(_allotments[_i], 2), si = _allotments$_i[0], ri = _allotments$_i[1];
          room = rooms[ri];
          room.occupants.push(students[si]._id);
          _context.next = 24;
          return regeneratorRuntime.awrap(room.save());

        case 24:
          students[si].room = room._id;
          _context.next = 27;
          return regeneratorRuntime.awrap(students[si].save());

        case 27:
          _i++;
          _context.next = 18;
          break;

        case 30:
          _context.next = 32;
          return regeneratorRuntime.awrap(User.create({
            username: 'student',
            email: 'priya@residencex.com',
            password: 'student123',
            role: 'student',
            studentRef: students[0]._id
          }));

        case 32:
          // ── FEES ──
          months = ['May 2024', 'June 2024', 'July 2024'];
          feeRecords = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 37;
          _iterator = students[Symbol.iterator]();

        case 39:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 63;
            break;
          }

          student = _step.value;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 44;

          for (_iterator2 = months[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            month = _step2.value;
            _month$split = month.split(' '), _month$split2 = _slicedToArray(_month$split, 2), m = _month$split2[0], y = _month$split2[1];
            monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(m);
            dueDate = new Date(parseInt(y), monthIndex, 5);
            status = student.feeStatus === 'paid' ? 'paid' : student.feeStatus === 'partial' ? month === 'July 2024' ? 'partial' : 'paid' : month === 'July 2024' ? 'unpaid' : 'paid';
            amount = 12000;
            feeRecords.push({
              student: student._id,
              amount: amount,
              month: month,
              dueDate: dueDate,
              status: status,
              paidAmount: status === 'paid' ? amount : status === 'partial' ? 6000 : 0,
              paidDate: status === 'paid' ? dueDate : null
            });
          }

          _context.next = 52;
          break;

        case 48:
          _context.prev = 48;
          _context.t0 = _context["catch"](44);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;

        case 52:
          _context.prev = 52;
          _context.prev = 53;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 55:
          _context.prev = 55;

          if (!_didIteratorError2) {
            _context.next = 58;
            break;
          }

          throw _iteratorError2;

        case 58:
          return _context.finish(55);

        case 59:
          return _context.finish(52);

        case 60:
          _iteratorNormalCompletion = true;
          _context.next = 39;
          break;

        case 63:
          _context.next = 69;
          break;

        case 65:
          _context.prev = 65;
          _context.t1 = _context["catch"](37);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 69:
          _context.prev = 69;
          _context.prev = 70;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 72:
          _context.prev = 72;

          if (!_didIteratorError) {
            _context.next = 75;
            break;
          }

          throw _iteratorError;

        case 75:
          return _context.finish(72);

        case 76:
          return _context.finish(69);

        case 77:
          _context.next = 79;
          return regeneratorRuntime.awrap(Fee.insertMany(feeRecords));

        case 79:
          _context.next = 81;
          return regeneratorRuntime.awrap(Complaint.create([{
            complaintId: 'C001',
            student: students[0]._id,
            title: 'Water leakage in bathroom',
            category: 'Plumbing',
            priority: 'urgent',
            status: 'open',
            description: 'There is water leaking from the overhead tank in bathroom.'
          }, {
            complaintId: 'C002',
            student: students[1]._id,
            title: 'Faulty light switch',
            category: 'Electrical',
            priority: 'medium',
            status: 'in-progress',
            description: 'The light switch in Room A102 trips frequently.'
          }, {
            complaintId: 'C003',
            student: students[4]._id,
            title: 'Poor Wi-Fi signal',
            category: 'Wi-Fi',
            priority: 'low',
            status: 'open',
            description: 'Wi-Fi signal is very weak on the 2nd floor.'
          }, {
            complaintId: 'C004',
            student: students[2]._id,
            title: 'Unhygienic washroom',
            category: 'Cleanliness',
            priority: 'high',
            status: 'resolved',
            description: 'Washroom on floor 1 has not been cleaned for 3 days.',
            resolvedAt: new Date()
          }, {
            complaintId: 'C005',
            student: students[0]._id,
            title: 'Food quality issue',
            category: 'Mess Food',
            priority: 'medium',
            status: 'resolved',
            description: 'Dal was undercooked during dinner.',
            resolvedAt: new Date()
          }]));

        case 81:
          _context.next = 83;
          return regeneratorRuntime.awrap(Notice.create([{
            title: 'Hostel Day Celebration 2024',
            body: 'Annual hostel day will be celebrated on 20th July. All residents are requested to participate in cultural events.',
            type: 'general',
            postedBy: adminUser._id
          }, {
            title: '⚠️ Water Supply Disruption',
            body: 'Water supply will be disrupted on 17th July from 9 AM to 1 PM due to maintenance work. Please store water accordingly.',
            type: 'urgent',
            postedBy: adminUser._id
          }, {
            title: 'Fee Payment Reminder',
            body: 'Last date for July fee payment is 10th July. Students with pending dues will incur a late fine of ₹500 per week.',
            type: 'info',
            postedBy: adminUser._id
          }, {
            title: 'New Mess Menu Effective Monday',
            body: 'A new and improved mess menu will be effective from Monday. Feedback forms are available at the mess counter.',
            type: 'general',
            postedBy: adminUser._id
          }]));

        case 83:
          _context.next = 85;
          return regeneratorRuntime.awrap(Visitor.create([{
            name: 'Mrs. Sunita Kaur',
            relation: 'Mother',
            phone: '+91 87654 32109',
            student: students[0]._id,
            inTime: new Date('2024-07-16T10:00:00'),
            outTime: new Date('2024-07-16T12:30:00'),
            status: 'out',
            loggedBy: adminUser._id
          }, {
            name: 'Mr. Ramesh Patel',
            relation: 'Father',
            phone: '+91 84321 09876',
            student: students[3]._id,
            inTime: new Date('2024-07-16T14:00:00'),
            status: 'inside',
            loggedBy: adminUser._id
          }, {
            name: 'Ms. Neha Sharma',
            relation: 'Sister',
            phone: '+91 83210 98765',
            student: students[4]._id,
            inTime: new Date('2024-07-16T15:15:00'),
            status: 'inside',
            loggedBy: adminUser._id
          }]));

        case 85:
          _context.next = 87;
          return regeneratorRuntime.awrap(Mess.create([{
            day: 'Monday',
            breakfast: 'Poha, Chai, Banana',
            lunch: 'Dal Tadka, Jeera Rice, Roti, Salad',
            dinner: 'Paneer Butter Masala, Naan, Dal Makhani'
          }, {
            day: 'Tuesday',
            breakfast: 'Idli Sambar, Coconut Chutney',
            lunch: 'Rajma, Steamed Rice, Roti, Raita',
            dinner: 'Kadai Chicken / Aloo Gobi, Tandoori Roti'
          }, {
            day: 'Wednesday',
            breakfast: 'Aloo Paratha, Curd, Pickle',
            lunch: 'Chole, Bhature, Kachumber Salad',
            dinner: 'Mix Veg Curry, Dal Fry, Steamed Rice, Roti'
          }, {
            day: 'Thursday',
            breakfast: 'Upma, Boiled Egg / Banana, Chai',
            lunch: 'Dal Palak, Jeera Rice, Roti, Papad',
            dinner: 'Egg Curry / Paneer Tikka Masala, Rice, Roti'
          }, {
            day: 'Friday',
            breakfast: 'Puri Bhaji, Chai',
            lunch: 'Sambar, Rasam, Steamed Rice, Poppadom',
            dinner: 'Special Biryani (Veg/Non-Veg), Raita, Salad'
          }, {
            day: 'Saturday',
            breakfast: 'Bread Omelette / Sandwich, Cornflakes',
            lunch: 'Dum Aloo, Pulao, Roti, Curd',
            dinner: 'Chicken Curry / Mushroom Masala, Roti, Rice'
          }, {
            day: 'Sunday',
            breakfast: 'Chole Bhature, Lassi',
            lunch: 'Special Sunday Thali — Dal, Sabzi, Rice, Roti, Dessert',
            dinner: 'Pasta / Chowmein, Soup, Garlic Bread'
          }]));

        case 87:
          console.log('✅ Seed complete!');
          console.log('   Admin   → username: admin   | password: admin123');
          console.log('   Student → username: student | password: student123');
          mongoose.disconnect();

        case 91:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[37, 65, 69, 77], [44, 48, 52, 60], [53,, 55, 59], [70,, 72, 76]]);
}

seed()["catch"](function (err) {
  console.error(err);
  mongoose.disconnect();
});
//# sourceMappingURL=seed.dev.js.map
