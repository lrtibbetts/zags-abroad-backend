#this is a python script to write excel to a file
import xlrd
import pymysql
from pymysql import cursors

#opens the workbook and references the spreadsheet
book = xlrd.open_workbook('../spreadsheets/sponsored_2018.xlsx')
sheet = book.sheet_by_index(1)

#connect to the database
connection = pymysql.connect(host = 'us-cdbr-iron-east-01.cleardb.net',
                            user = 'bb1f6f893c4a2e',
                            password = '12aba883',
                            db = 'heroku_6d22e6ede03be83',
                            charset = 'utf8mb4',
                            cursorclass = cursors.DictCursor)
print ("Connection!")

cursor = connection.cursor()
query = """INSERT INTO programs(host_program, program_type, host_url, application_link, city, country) VALUES(%s, %s, %s, %s, %s, %s)"""

for r in range(1, sheet.nrows):
    host_program = sheet.cell(r,0).value
    program_type = ""
    host_url = ""
    application_link = ""
    city = ""
    country = ""

    values = (host_program, program_type, host_url, application_link, city, country)

    cursor.execute(query, values)
    print(values)

cursor.close()
connection.commit()
connection.close()
print("You Done")
