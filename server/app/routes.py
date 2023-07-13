import json
import uuid
import qrcode
import base64
import io

from flask import request, jsonify
from flask_wtf import FlaskForm
# from wtforms import StringField
# from wtforms.validators import DataRequired
from flask_wtf.csrf import generate_csrf
from flask_wtf.file import FileField, FileRequired

from app import app, rekognition_client, s3_client
from app.utils import process_result

import base64

class createForm(FlaskForm):
    image = FileField("image", validators=[FileRequired()])

class qrCodeForm(FlaskForm):
    image = FileField("image", validators=[FileRequired()])
    # rekognition_data = StringField("rekognition_data", validators=[DataRequired()])


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

        rekognition_result = rekognition_client.detect_faces(
            Image={"Bytes": image_bytes}, Attributes=["EMOTIONS"]
        )

        # print(process_result(rekognition_result))

        result, avg_score = process_result(rekognition_result)
        result = sorted(result.items(), key=lambda x: x[1], reverse=True)

        big_emotion = None
        top_emotion = list(avg_score.keys())[0]  # Top emotion will always be first element

        if avg_score[top_emotion] > 90 and len(rekognition_result["FaceDetails"]) > 0:  # TODO: put back to 2
            big_emotion = top_emotion

        return jsonify({"result": result, "big_emotion": big_emotion})

    # Error handling
    print(form.errors)
    return jsonify({"error": "Form validation failed. Please check the form data."})

@app.route("/api/generate_qr_code", methods=["POST"])
def generate_qr_code():
    form = qrCodeForm()

    if form.validate():
        image_bytes = form.image.data.read()
        # rekognition_data = form.rekognition_data

        base64_image = base64.b64encode(image_bytes).decode('utf-8')

        s3_filename = str(uuid.uuid4()) + ".jpg"

        s3_client.put_object(
            Body=image_bytes, 
            Bucket="sentiment-analysis-showcase-photos", 
            Key=s3_filename, 
            ContentType="image/jpg"
        )
        
        response_url = s3_client.generate_presigned_url(
            "get_object", 
            Params={
                "Bucket": "sentiment-analysis-showcase-photos", 
                "Key": s3_filename
            }
        )

        qr_code = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
        )
        qr_code.add_data(response_url)
        qr_code.make(fit=True)
        qr_code_image = qr_code.make_image()
        stream = io.BytesIO()
        qr_code_image.save(stream)
        qr_code_base64 = base64.b64encode(stream.getvalue()).decode()

        return jsonify({
            "url": response_url,
            "image": qr_code_base64
        })
    
    # Error handling
    print(form.errors)
    return jsonify({"error": "Form validation failed. Please check the form data."})