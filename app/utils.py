def find_emotion(emotions):
    num = {"Confidence": 0.0, "Type": None}

    for emotion in emotions:
        if emotion["Confidence"] > num["Confidence"]:
            num = emotion

    return num


def find_general_emotion(emotions, total):
    general_sentiment = None
    count = 0

    if total == 0:
        return ("None", "0%")

    for emotion, num in emotions.items():
        if num > count:
            count = num
            general_sentiment = emotion

    # Percentage of main emotions in 3 s.f.
    percentage = f"{(count / total) * 100:.3g}%"

    return (general_sentiment, percentage)


def process_result(result):
    faces = result["FaceDetails"]
    emotions = {}
    response = {"faces":[]}

    for face in faces:
        emotion_map = find_emotion(face["Emotions"])
        emotion = emotion_map["Type"]

        # Initialise emotion in dictionary
        if emotion not in emotions:
            emotions[emotion] = 0

        emotions[emotion] += 1

        box = face["BoundingBox"]

        x1 = int(box["Left"] * WIDTH)
        y1 = int(box["Top"] * HEIGHT)
        x2 = int(box["Left"] * WIDTH + box["Width"] * WIDTH)
        y2 = int(box["Top"] * HEIGHT + box["Height"] * HEIGHT)

        response["faces"].append([x1, y1, x2, y2])


    response["text"] = f"{percentage} {general_sentiment.lower()}"

    return response
