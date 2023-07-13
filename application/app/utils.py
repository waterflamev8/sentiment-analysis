def find_emotion(emotions, emotionScore):
    num = {"Confidence": 0.0, "Type": None}

    for emotion in emotions:
        if emotion["Type"] not in emotionScore:
            emotionScore[emotion["Type"]] = 0

        emotionScore[emotion["Type"]] += float(emotion["Confidence"])

        if emotion["Confidence"] > num["Confidence"]:
            num = emotion

    return (num, emotionScore)


# def find_general_emotion(emotions, total):
#     general_sentiment = None
#     count = 0

#     if total == 0:
#         return ("None", "0%")

#     for emotion, num in emotions.items():
#         if num > count:
#             count = num
#             general_sentiment = emotion

#     # Percentage of main emotions in 3 s.f.
#     percentage = f"{(count / total) * 100:.3g}%"

#     return (general_sentiment, percentage, total)


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
