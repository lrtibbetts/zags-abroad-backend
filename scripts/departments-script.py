#departments script
import xlrd
import pymysql
from pymysql import cursors

#opens the workbook and references the spreadsheet
#add a file path
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

cursor = connection.cursor()
query = """INSERT INTO departments(dept_name, dept_code, school) VALUES(%s,%s,%s)"""

for r in range(0, sheet.nrows):
    dept_name = sheet.cell(r,0).value
    dept_code = sheet.cell(r, 1).value
    school = sheet.cell(r, 2).value

    values = (dept_name, dept_code, school)
    cursor.execute(query, values)
    print(values)

cursor.close()
connection.commit()
connection.close()
print("You Done")
