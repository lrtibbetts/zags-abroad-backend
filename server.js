const core = require('./routes/core.js');
const subjects = require('./routes/subjects.js');
const programs = require('./routes/programs.js');
const departments = require('./routes/departments.js');
const courses = require('./routes/courses.js');
const accounts = require('./routes/accounts.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.get('/core', core.getCore);
app.get('/subjects', subjects.getSubjects);
app.get('/programs', programs.getPrograms);
app.get('/departments', departments.getDepartments);
app.get('/courses', courses.getCourses);
app.post('/addcourse', courses.addCourse);
app.post('/deletecourse', courses.deleteCourse);
app.post('/editcourse', courses.editCourse);
app.post('/filterbysubject', courses.filterBySubject);
app.post('/login', accounts.logIn);
app.post('/signup', accounts.signUp);

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

module.exports = app
