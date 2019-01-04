
#this is a python script to write excel to a file
import xlrd
import pymysql
from pymysql import cursors
from datetime import datetime

#opens the workbook and references the spreadsheet
book = xlrd.open_workbook('../spreadsheets/sponsored_2018.xlsx')
sheet = book.sheet_by_index(0)

#connect to the database
connection = pymysql.connect(host = 'us-cdbr-iron-east-01.cleardb.net',
                            user = 'bb1f6f893c4a2e',
                            password = '12aba883',
                            db = 'heroku_6d22e6ede03be83',
                            charset = 'utf8mb4',
                            cursorclass = cursors.DictCursor)
print ("Connection!")

cursor = connection.cursor()
query = """INSERT INTO course_equivalencies(host_program, host_course_number, host_course_name,
gu_course_number, gu_course_name, core, comments, signature_needed, approved_by, approval_date, approved_until, department) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""

for r in range(0, sheet.nrows):
    host_program = sheet.cell(r,0).value
    host_course_number = sheet.cell(r,1).value
    host_course_name = sheet.cell(r,2).value
    gu_course_number = sheet.cell(r,3).value
    gu_course_name = sheet.cell(r,4).value
    core = sheet.cell(r,5).value
    comments = sheet.cell(r,6).value
    signature_needed = sheet.cell(r,7).value
    approved_by = sheet.cell(r,8).value
    if(sheet.cell(r,9).value == ''):
        approval_date = ''
    else:
        approval_date = xlrd.xldate.xldate_as_datetime(int(sheet.cell(r, 9).value), book.datemode).strftime('%Y-%m-%d');
    if(sheet.cell(r,10).value == ''):
        approved_until = ''
    else:
        approved_until = xlrd.xldate.xldate_as_datetime(int(sheet.cell(r, 10).value), book.datemode).strftime('%Y-%m-%d');
    #approved_until = xlrd.xldate.xldate_as_datetime(int(sheet.cell(r, 9).value), book.datemode).strftime('%m/%d/%Y');
    department = sheet.cell(r,11).value

    values = (host_program, host_course_number, host_course_name,
    gu_course_number, gu_course_name, core, comments, signature_needed, approved_by, approval_date, approved_until, department)

    cursor.execute(query, values)
    print(values)

cursor.close()
connection.commit()
connection.close()
print("You Done")
