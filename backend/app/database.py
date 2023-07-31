"""
Defines database model for SQLAlchemy
"""

from . import db
from datetime import datetime

'''
DB for user sessions including positions of articles and relevant info about users
'''


class Users(db.Model):
    user_id = db.Column(db.String(500), primary_key=True)
    timestamp_start = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    experimental_condition = db.Column(db.String(500))


'''
DB for for each homepage exposure (nested in UserSessions)
'''


class Exposures(db.Model):
    user_id = db.Column(db.String(500), db.ForeignKey('users.user_id'))
    timestamp_exposures = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    exposure_id = db.Column(db.String(500), primary_key=True)
    exposure_number = db.Column(db.Integer)


'''
DB for all articles that users selected
'''


class Selections(db.Model):
    article_id = db.Column(db.String(50))
    position = db.Column(db.Integer, db.ForeignKey('positions.position'))
    user_id = db.Column(db.String(500), db.ForeignKey('users.user_id'))
    timestamp_selections = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    previous_scroll_rate = db.Column(db.String(50))
    title = db.Column(db.String(50))
    condition = db.Column(db.String(50))
    exposure_id = db.Column(db.String(500))
    # same_selection_number = db.Column(db.Integer) --- see if necessary
    primary = db.Column(db.String(500), primary_key=True)


'''
DB for all articles that users read
'''


class Reads(db.Model):
    article_id = db.Column(db.String(50))
    read_title = db.Column(db.String(50))
    read_condition = db.Column(db.String(50))
    user_id = db.Column(db.String(500), db.ForeignKey('users.user_id'))
    timestamp_reads = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    max_scroll = db.Column(db.String(50))
    primary = db.Column(db.String(500), primary_key=True)
    exposure_id = db.Column(db.String(500))


'''
DB to log article positions per user
'''


class Positions(db.Model):
    article_id = db.Column(db.String(50))
    user_id = db.Column(db.String(500), db.ForeignKey('users.user_id'))
    position = db.Column(db.Integer)
    primary = db.Column(db.String(500), primary_key=True)
