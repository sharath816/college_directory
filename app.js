const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = require('./connection');

app.post('/admin/add-student', (req,res) => {
    const { name, email} = req.body;
    db.query('insert into students (name, email) values ($1, $2)', [name, email], (error) => {
        if(error) {
            return res.status(500).send('Error adding student');
        }
        res.status(200).send('Student added successfully');
    });
});


app.get('/admin/students', (req,res) => {
    db.query('select * from students', (error, results) => {
        if(error){
            return res.status(500).send('Error fetching students');
        }
        res.status(200).json(results.rows);
    });
});

app.post('/faculty/grade-student', (req,res) => {
    const { studentId, courseId, grade} = req.body;
    db.query(
        'update grades set grade = $1 where student_id = $2 and course_id = $3',
        [grade, studentId, courseId],
        (error) => {
            if(error){
                return res.status(500).send('Error fetching courses');
            }
            res.status(200).json('Grade updated successfully');
        }
    );
});

app.get('/student/grades/:studentId', (req,res) => {
    const studentId = req.params.studentId;
    db.query(
        'select *from grades where student_id = $1',
        [studentId],
        (error, results) => {
            if(error){
                return res.status(500).send('error fetching grades');
            }
            res.status(200).json(results.rows);
        }
    );
});

app.listen(port, () => {
    console.log('Server running on port ${port}');
});