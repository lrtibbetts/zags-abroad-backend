# This file can be used to recreate our database when we switch to a new server

import pymysql
from pymysql import cursors

# Making a connection to the destination db
db = pymysql.connect(
  user = "root",
  password = "pass1234",
  db = "mysql"
)

# Creating cursor for the tables
cur = db.cursor()

# Creating the tables
account_table = """CREATE TABLE IF NOT EXISTS accounts(
    email VARCHAR(50) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(100),
    is_admin tinyint(4) DEFAULT 0,
    is_verified tinyint(4) DEFAULT 0,
    token VARCHAR(100),
    PRIMARY KEY(email)
  )"""

core_table = """CREATE TABLE IF NOT EXISTS core_designations(
  core_name VARCHAR(200)
)"""

course_table = """CREATE TABLE IF NOT EXISTS  course_equivalencies(
  id INT(11) NOT NULL AUTO_INCREMENT,
  host_program VARCHAR(150) NOT NULL,
  host_course_number VARCHAR(150),
  host_course_name VARCHAR(150) NOT NULL,
  gu_course_number VARCHAR(150) NOT NULL,
  gu_course_name VARCHAR(150) NOT NULL,
  core VARCHAR(150),
  comments VARCHAR(150),
  signature_needed VARCHAR(20) NOT NULL,
  approved_by VARCHAR(150) NOT NULL,
  approval_date VARCHAR(50) NOT NULL,
  approved_until VARCHAR(50),
  department VARCHAR(150) NOT NULL,
  PRIMARY KEY(id)
)"""

department_table = """CREATE TABLE IF NOT EXISTS departments(
  dept_name VARCHAR(50),
  dept_code VARCHAR(20),
  school VARCHAR(65)
)"""

photo_table = """CREATE TABLE IF NOT EXISTS photos(
  program VARCHAR(100) NOT NULL,
  url VARCHAR(250) NOT NULL,
  survey_id INT(11),
  height INT(11),
  width INT(11),
  approved tinyint(4) DEFAULT 0,
  admin_selected tinyint(4) DEFAULT 0
)"""

program_table = """CREATE TABLE IF NOT EXISTS programs(
  host_program VARCHAR(50) NOT NULL,
  program_type VARCHAR(45) NOT NULL,
  application_link VARCHAR(150),
  city VARCHAR(45) NOT NULL,
  lat decimal(19,15),
  lng decimal(19,15),
  PRIMARY KEY(host_program)
)"""

saved_table = """CREATE TABLE IF NOT EXISTS saved_courses(
  email VARCHAR(50) NOT NULL,
  course_id INT(11) NOT NULL,
  PRIMARY KEY(email, course_id)
)"""

subject_table = """CREATE TABLE IF NOT EXISTS subjects(
  subject_code VARCHAR(20),
  subject_name VARCHAR(75)
)"""

survey_table = """CREATE TABLE IF NOT EXISTS survey(
    ID INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    major VARCHAR(100),
    program VARCHAR(100),
    term VARCHAR(50),
    calendar_year INT(11),
    year VARCHAR(50),
    residence VARCHAR(1000),
    trips VARCHAR(1000),
    classes VARCHAR(1000),
    activities VARCHAR(1000),
    staff VARCHAR(1000),
    approved tinyint(1) DEFAULT 0,
    timestamp VARCHAR(20),
    PRIMARY KEY(ID)
  )"""

# List of all the queries
commands = [account_table, core_table, course_table, department_table, photo_table, program_table, saved_table, subject_table, survey_table]

# loop to create all the tables in the new db
for item in commands:
    cur.execute(item)
    db.commit()
    print(item + " was added to the database")

# Close the connection
cur.close()
db.close()
