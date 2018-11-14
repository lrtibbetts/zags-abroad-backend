#this is a python script to write excel to a file
import xlrd
import pymysql
from pymysql import cursors

#opens the workbook and references the spreadsheet
book = xlrd.open_workbook('sponsored_2018.xlsx')
sheet = book.sheet_by_index(3)

#connect to the database
connection = pymysql.connect(host = 'us-cdbr-iron-east-01.cleardb.net',
                            user = 'bb1f6f893c4a2e',
                            password = '12aba883',
                            db = 'heroku_6d22e6ede03be83',
                            charset = 'utf8mb4',
                            cursorclass = cursors.DictCursor)
print ("Connection!")

query = """INSERT INTO subjects(subject_code, subject_name) VALUES(%s, %s)"""

for r in range(1, sheet.nrows):
    subject_code = sheet.cell(r,0).value
    subject_name = sheet.cell(r,1).value

    values = (subject_code, subject_name)

    cursor.execute(query, values)
    print(values)

cursor = connection.cursor()
cursor.close()
connection.commit()
connection.close()
print("You Done")
