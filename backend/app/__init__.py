from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from pathlib import Path

db_file = Path.cwd() / 'app.db'

newsapp = Flask(__name__)
newsapp.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_file}"
newsapp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
newsapp.config['PROPAGATE_EXCEPTIONS'] = True  # To allow flask propagating exception even if debug is set to false on app
db = SQLAlchemy(newsapp)
migrate = Migrate(newsapp, db)
newsapp.secret_key = "youwillneverguess"

# to allow cross-domain access during development stage
cors = CORS(newsapp)
newsapp.config['CORS_Headers'] = 'Content-Type'

from . import routes, database
