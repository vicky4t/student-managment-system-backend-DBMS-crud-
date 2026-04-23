const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// ===== MIDDLEWARE =====
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://student-managment-system-dbms-crud.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://vickey4t_db_user:Jockey@5656@cluster0.x0dbzug.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });

// ===== SCHEMA =====
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name too long'],
  },
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: { values: ['CS', 'IT', 'ECE', 'CE'], message: 'Invalid branch' },
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: { values: ['M', 'F'], message: 'Gender must be M or F' },
  },
  dob: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// ===== ROUTES =====

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Student Management API running 🚀' });
});

// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const { branch, gender, search } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
      ];
    }
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single student
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST create student
app.post('/api/students', async (req, res) => {
  try {
    const { name, rollNo, branch, gender, dob } = req.body;
    const existing = await Student.findOne({ rollNo: rollNo?.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: `Roll number ${rollNo} already exists` });
    }
    const student = new Student({ name, rollNo, branch, gender, dob: dob || null });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, rollNo, branch, gender, dob } = req.body;
    // Check if roll no taken by another student
    if (rollNo) {
      const existing = await Student.findOne({ rollNo: rollNo.toUpperCase(), _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: `Roll number ${rollNo} already used by another student` });
      }
    }
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, rollNo, branch, gender, dob: dob || null },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: `Student "${student.name}" deleted successfully`, deleted: student });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/students`);
});
