def find_emotion(emotions, emotionScore):
    num = {"Confidence": 0.0, "Type": None}

    for emotion in emotions:
        if emotion["Type"] not in emotionScore:
            emotionScore[emotion["Type"]] = 0

        emotionScore[emotion["Type"]] += float(emotion["Confidence"])

        if emotion["Confidence"] > num["Confidence"]:
            num = emotion

    return (num, emotionScore)

def process_result(result):
    faces = result["FaceDetails"]
    emotions = {}
    overallEmotionScore = {}  # Maps emotion to total "percentage"
    averageEmotionScore = {}

    for face in faces:
        emotion_map, overallEmotionScore = find_emotion(face["Emotions"], overallEmotionScore)
        emotion = emotion_map["Type"]

        # Initialise emotion in dictionary
        if emotion not in emotions:
            emotions[emotion] = 0

        emotions[emotion] += 1

    for emotion in overallEmotionScore:
        averageEmotionScore[emotion] = overallEmotionScore[emotion] / len(faces)

    return (emotions, averageEmotionScore)
