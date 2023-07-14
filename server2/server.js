require('dotenv').config() 

const express = require('express');
const aws = require('aws-sdk');
const uuid = require('uuid');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');

const app = express (); 

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const rekognition = new aws.Rekognition();
const s3 = new aws.S3();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

const { PORT=3000, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

aws.config.update({
    accessKeyId: AWS_ACCESS_KEY, 
    secretAccessKey: AWS_SECRET_ACCESS_KEY, 
    region: AWS_REGION
});

function findEmotion(emotions, emotionScore) 
{
    let num = {"Confidence": 0.0, "Type": null};

    for (let emotion of emotions) {
        if (!(emotion["Type"] in emotionScore)) {
            emotionScore[emotion["Type"]] = 0;
        }

        emotionScore[emotion["Type"]] += parseFloat(emotion["Confidence"]);

        if (emotion["Confidence"] > num["Confidence"]) {
            num = emotion;
        }
    }

    return [num, emotionScore];
}

function processResult(result) {
    let faces = result["FaceDetails"];
    let emotions = {};
    let overallEmotionScore = {};
    let averageEmotionScore = {};

    for (let face of faces) {
        let [emotionMap, overall] = findEmotion(face["Emotions"], overallEmotionScore);
        let emotion = emotionMap["Type"];

        if (!(emotion in emotions)) {
            emotions[emotion] = 0;
        }

        emotions[emotion] += 1;
        overallEmotionScore = overall;
    }

    for (let emotion in overallEmotionScore) {
        averageEmotionScore[emotion] = overallEmotionScore[emotion] / faces.length;
    }

    return [emotions, averageEmotionScore];
}

app.use("/", serveStatic(path.join(__dirname, 'public')))

app.post("/process", async (req, res) => 
{
    let { frame } = req.body;
    const image_data = frame.split(',')[1];
    let imageBytes = Buffer.from(image_data, 'base64');

    let rekognitionResult = await rekognition.detectFaces({
        Image: {"Bytes": imageBytes},
        Attributes: ["EMOTIONS"]
    }).promise();

    let [result, avgScore] = processResult(rekognitionResult);
    result = Object.entries(result).sort((a, b) => b[1] - a[1]);

    let bigEmotion = null;
    let topEmotion = Object.keys(avgScore)[0];  // Top emotion will always be first element

    if (rekognitionResult["FaceDetails"].length > 1) {
        if (topEmotion == "HAPPY" && avgScore[topEmotion] > 96) {
            bigEmotion = topEmotion;
        } else if (topEmotion == "SAD" && avgScore[topEmotion] > 75) {
            bigEmotion = topEmotion;
        } else if (topEmotion == "FEAR" && avgScore[topEmotion] > 50) {
            bigEmotion = topEmotion;
        } else if (avgScore[topEmotion] > 50) {
            bigEmotion = topEmotion;
        }
    }

    res.json({"result": result, "big_emotion": bigEmotion});
});

app.post("/generate_qr_code", async (req, res) => {
    let { frame } = req.body;
    const image_data = frame.split(',')[1];
    let imageBytes = Buffer.from(image_data, 'base64');

    let s3Filename = uuid.v4() + ".jpg";
    await s3.putObject({
        Body: imageBytes,
        Bucket: S3_BUCKET_NAME,
        Key: s3Filename,
        ContentType: "image/jpg"
    }).promise();

    let s3ImageUrl = s3.getSignedUrl('getObject', {
        Bucket: S3_BUCKET_NAME,
        Key: s3Filename,
        Expires: 3600  // Expiration time of the URL in seconds
    });

    let qrCodeBase64 = await qrcode.toDataURL(s3ImageUrl);

    res.json({
        "url": s3ImageUrl,
        "image": qrCodeBase64
    });
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
