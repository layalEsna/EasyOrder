# # Standard library imports
# from os import getenv
# from dotenv import load_dotenv

# load_dotenv()
# # Remote library imports
# from flask import Flask
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask_restful import Api
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from sqlalchemy import MetaData





# # Local imports


# # Instantiate app, set attributes
# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/layla/Development/code/se-prep/phase-4/EasyOrder/server/app.db'

# # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# app.config['SECRET_KEY'] = getenv('SECRET_KEY')
# app.config['SESSION_PERMANENT'] = True
# app.config['SESSION_TYPE'] = 'filesystem'


# app.json.compact = False

# # Define metadata, instantiate db
# metadata = MetaData(naming_convention={
#     "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
# })
# db = SQLAlchemy(metadata=metadata)
# bcrypt = Bcrypt(app)
# migrate = Migrate(app, db)
# db.init_app(app)

# # Instantiate REST API
# api = Api(app)

# # Instantiate CORS
# CORS(app)


##############################
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or "default_secret_key"
    SQLALCHEMY_DATABASE_URI = 'sqlite:////Users/layla/Development/code/se-prep/phase-4/EasyOrder/server/app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_PERMANENT = True
    SESSION_TYPE = 'filesystem'




