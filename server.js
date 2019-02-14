const core = require('./routes/core.js');
const subjects = require('./routes/subjects.js');
const programs = require('./routes/programs.js');
const departments = require('./routes/departments.js');
const courses = require('./routes/courses.js');
const accounts = require('./routes/accounts.js');
const survey = require('./routes/survey.js');
const saved_courses = require('./routes/saved_courses.js');
const photos = require('./routes/photos.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.get('/core', core.getCore);
app.post('/programcore', core.programCore);
app.get('/subjects', subjects.getSubjects);
app.post('/programsubjects', subjects.programSubjects);
app.get('/programs', programs.getPrograms);
app.get('/locations', programs.getLocations);
app.get('/departments', departments.getDepartments);
app.get('/courses', courses.getCourses);
app.post('/programcourses', courses.programCourses);
app.post('/addcourse', courses.addCourse);
app.post('/deletecourse', courses.deleteCourse);
app.post('/editcourse', courses.editCourse);
app.post('/mainsearch', courses.mainSearch);
app.post('/detailsearch', courses.detailSearch);
app.post('/login', accounts.logIn);
app.post('/signup', accounts.signUp);
app.post('/submitsurvey', survey.submitSurvey);
app.get('/surveys', survey.getSubmittedSurveys);
app.post('/programsurveys', survey.programSurveys);
app.post('/savecourse', saved_courses.saveCourse);
app.post('/accountcourses', saved_courses.accountCourses);
app.post('/deleteaccountcourse', saved_courses.deleteAccountCourse);
app.post('/photos', photos.submitPhotos);
app.post('/programphotos', photos.getProgramPhotos);

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

module.exports = app
