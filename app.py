from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# Website configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['UPLOAD_FOLDER'] = 'static/car-images'

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

from routes import *  # Import routes after app initialization

if __name__ == '__main__':
    app.run(debug=True)  

