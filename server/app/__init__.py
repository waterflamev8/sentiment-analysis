import os

from flask import Flask
import boto3
from flask_cors import CORS

session = boto3.Session()
client = session.client("rekognition", region_name=os.getenv("REGION"))

app = Flask(__name__)
CORS(app)

from app import routes