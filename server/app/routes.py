import json

from flask import request, jsonify
from flask_wtf import FlaskForm
from flask_wtf.csrf import generate_csrf
from flask_wtf.file import FileField, FileRequired

from app import app, client
from app.utils import process_result


class createForm(FlaskForm):
    image = FileField("image", validators=[FileRequired()])


@app.route("/")
def index():
    return "<h1>Hello world</h1>"


@app.route("/generate_csrf_token")
def generate_csrf_token():
    return jsonify({"csrf_token": generate_csrf()})


@app.route("/process", methods=["POST"])
def process():
    # buffer = request.json["buffer"]

    # img_bytes = bytearray(buffer)
    # rekognition_result = client.detect_faces(
    #     Image={"Bytes": img_bytes}, Attributes=["EMOTIONS"]
    # )
    # return process_result(rekognition_result)
    form = createForm()

    if form.validate():
        image_bytes = form.image.data.read()

        rekognition_result = client.detect_faces(
        	Image={"Bytes": image_bytes}, Attributes=["EMOTIONS"]
        )

        print(process_result(rekognition_result))

        # success, buffer = cv2.imencode(".jpeg", image)

        # # Error handling
        # if not success:
        # 	print("Error")

        # img_bytes = bytearray(image)
        # print(img_bytes)



    return jsonify({"greeting": "hello"})
