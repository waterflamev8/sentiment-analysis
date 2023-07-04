import os

from flask import Flask
import boto3
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect  # Add this import

session = boto3.Session()
client = session.client("rekognition", region_name=os.getenv("REGION"))

app = Flask(__name__)
CORS(app)
csrf = CSRFProtect(app)  # Initialize the CSRFProtect extension

from app import routes
