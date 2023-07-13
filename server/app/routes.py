import uuid
import qrcode
import base64
import os
import io
from flask import request, jsonify
from app import app, rekognition_client, s3_client
from app.utils import process_result
import base64

@app.route("/process", methods=["POST"])
def process():
    content = request.json
    image_data = content["frame"].split(",")[1]

    image_bytes = base64.b64decode(image_data)

    rekognition_result = rekognition_client.detect_faces(
        Image={"Bytes": image_bytes}, Attributes=["EMOTIONS"]
    )

    result, avg_score = process_result(rekognition_result)
    result = sorted(result.items(), key=lambda x: x[1], reverse=True)

    big_emotion = None
    top_emotion = list(avg_score.keys())[0]  # Top emotion will always be first element

    if len(rekognition_result["FaceDetails"]) > 1:

        if top_emotion == "HAPPY" and avg_score[top_emotion] > 96:
            big_emotion = top_emotion

        elif top_emotion == "SAD" and avg_score[top_emotion] > 75:
            big_emotion = top_emotion

        elif top_emotion == "FEAR" and avg_score[top_emotion] > 50:
            big_emotion = top_emotion

        elif avg_score[top_emotion] > 50:
            big_emotion = top_emotion

    return jsonify({"result": result, "big_emotion": big_emotion})

@app.route("/generate_qr_code", methods=["POST"])
def generate_qr_code():
    content = request.json
    image_data = content["frame"].split(",")[1]
    image_bytes = base64.b64decode(image_data)

    bucket_name = os.getenv("S3_BUCKET_NAME")

    s3_filename = str(uuid.uuid4()) + ".jpg"
    s3_client.put_object(
        Body=image_bytes,
        Bucket=bucket_name,
        Key=s3_filename,
        ContentType="image/jpg"
    )

    image_url = get_s3_image_url(bucket_name, s3_filename)
    qr_code_base64 = generate_qr_code_image(image_url)

    return jsonify({
        "url": image_url,
        "image": qr_code_base64
    })

def get_s3_image_url(bucket_name, s3_filename):
    response_url = s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": bucket_name,
            "Key": s3_filename
        }
    )
    return response_url

def generate_qr_code_image(content):
    qr_code = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=5,
    )
    qr_code.add_data(content)
    qr_code.make(fit=True)
    qr_code_image = qr_code.make_image()
    stream = io.BytesIO()
    qr_code_image.save(stream)
    qr_code_base64 = base64.b64encode(stream.getvalue()).decode()

    return qr_code_base64