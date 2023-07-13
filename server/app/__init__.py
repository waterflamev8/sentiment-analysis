import os

from flask import Flask
import boto3
from flask_cors import CORS

session = boto3.Session()
rekognition_client = session.client("rekognition", region_name=os.getenv("REGION") or "ap-southeast-1")
s3_client = session.client("s3", region_name=os.getenv("REGION") or "ap-southeast-1")

app = Flask(__name__)
CORS(app)

from app import routes
