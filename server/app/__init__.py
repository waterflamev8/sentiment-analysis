import os

from flask import Flask
import boto3
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect


session = boto3.Session()
client = session.client("rekognition", region_name=os.getenv("REGION"))

app = Flask(__name__)
CORS(app, use_credentials=True)
CSRFProtect(app)

from app import routes
