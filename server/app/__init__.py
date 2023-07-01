import os

from flask import Flask
import boto3


session = boto3.Session()
client = session.client("rekognition", region_name=os.getenv("REGION"))

app = Flask(__name__)

from app import routes
