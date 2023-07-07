import json

from flask import request, jsonify
from flask_wtf import FlaskForm
from flask_wtf.csrf import generate_csrf
from flask_wtf.file import FileField, FileRequired

from app import app, client
from app.utils import process_result

import base64

class createForm(FlaskForm):
    image = FileField("image", validators=[FileRequired()])


@app.route("/api")
def index():
    return "<h1>Hello world</h1>"


@app.route("/api/generate_csrf_token")
def generate_csrf_token():
    return jsonify({"csrf_token": generate_csrf()})


@app.route("/api/process", methods=["POST"])
def process():
    form = createForm()

    if form.validate():
        image_bytes = form.image.data.read()

        # Convert to base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')

        rekognition_result = client.detect_faces(
            Image={"Bytes": image_bytes}, Attributes=["EMOTIONS"]
        )

        print(process_result(rekognition_result))

        result = process_result(rekognition_result)
        result = sorted(result.items(), key=lambda x: x[1], reverse=True)

        return jsonify({"result": result})

    # Error handling
    print(form.errors)
    return jsonify({"error": "Form validation failed. Please check the form data."})
