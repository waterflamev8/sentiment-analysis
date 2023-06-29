import json

from flask import request

from app import app
from app.utils import process_result

@app.route("/")
def index():
	return "<h1>Hello world</h1>"

@app.route("/process", methods=["POST"])
def process():
	buffer = request.json["buffer"]

	img_bytes = bytearray(buffer)
	rekognition_result = client.detect_faces(Image={"Bytes": img_bytes}, Attributes=["DEFAULT", "EMOTIONS"])
	return process_result(rekognition_result)
