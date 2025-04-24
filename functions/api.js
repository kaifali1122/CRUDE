const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crud_tutorial', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: String,
    subjects: [String],
    status: { type: String, default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// CRUD Routes
// Create
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read (Get All)
app.get('/api/students', async (req, res) => {
    try {
        const { grade, age, sort, limit, skip } = req.query;
        let query = {};
        
        if (grade) query.grade = grade;
        if (age) query.age = { $gt: parseInt(age) };
        
        let studentsQuery = Student.find(query);
        
        if (sort) studentsQuery = studentsQuery.sort(sort);
        if (limit) studentsQuery = studentsQuery.limit(parseInt(limit));
        if (skip) studentsQuery = studentsQuery.skip(parseInt(skip));
        
        const students = await studentsQuery;
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read (Get One)
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update
app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete
app.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the Express app as a serverless function
module.exports = app; 