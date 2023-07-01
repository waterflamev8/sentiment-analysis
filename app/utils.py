def find_emotion(emotions):
    num = {"Confidence": 0.0, "Type": None}

    for emotion in emotions:
        if emotion["Confidence"] > num["Confidence"]:
            num = emotion

    return num


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

    for face in faces:
        emotion_map = find_emotion(face["Emotions"])
        emotion = emotion_map["Type"]

        # Initialise emotion in dictionary
        if emotion not in emotions:
            emotions[emotion] = 0

        emotions[emotion] += 1

    return emotions
