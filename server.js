//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');

//Declares that we are using an express object
var app = express();

//DELCARING THE ROUTES TO THE DIFFERENT FILES
const accountsRouter = require('./routes/accounts.js');
const coreRouter = require('./routes/core.js');
const courseRouter = require('./routes/course_equivalencies.js')
const deptRouter = require('./routes/departments.js')
const subjRouter = require('./routes/subjects.js')

app.use(accountsRouter);
app.use(coreRouter);
app.use(courseRouter);
app.use(deptRouter);
app.use(subjRouter);

//Port determined by Heroku, else default as localhost:3000
var port = process.env.PORT || 3001;

app.listen(port, function() {
    console.log('Listening on port ' + port);
});
