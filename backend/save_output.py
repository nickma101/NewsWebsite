import csv
from app import db
from app.database import Exposures, Selections, Ratings, Articles, Nudges, User


def sql_query_to_csv(query_output, columns_to_exclude=""):
    rows = query_output
    columns_to_exclude = set(columns_to_exclude)
    column_names = [i for i in rows[0].__dict__]
    for column_name in columns_to_exclude:
        column_names.pop(column_names.index(column_name))
    column_names.sort()
    csv = ", ".join(column_names) + "\n"
    for row in rows:
        for column_name in column_names:
            if column_name not in columns_to_exclude:
                data = str(row.__dict__[column_name])
                data.replace('"', '""')
                csv += '"' + data + '"' + ","
        csv += "\n"
    return csv

query = Articles.query.all()
query2 = Exposures.query.all()
query3 = Selections.query.all()
query4 = Ratings.query.all()
query5 = Nudges.query.all()
query6 = User.query.all()
Articles = sql_query_to_csv(query)
Exposures = sql_query_to_csv(query2)
Selections = sql_query_to_csv(query3)
Ratings = sql_query_to_csv(query4)
Nudges = sql_query_to_csv(query5)
User = sql_query_to_csv(query6)

print(Articles)
