import cv2

from constants import HEIGHT, FONT, WIDTH, TEXT_COLOUR


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


def process_frame(frame, response):
    faces = response["FaceDetails"]
    emotions = {}

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

        # Draw rectangle around face
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        # y1 = y1 - 15 if y1 - 15 > 15 else y1 + 15

    # print(emotions)
    general_sentiment, percentage = find_general_emotion(emotions, len(faces))
    cv2.putText(
        frame,
        f"{percentage} {general_sentiment.lower()}",
        (20, 40),
        FONT,
        2,
        TEXT_COLOUR,
        1,
        cv2.LINE_AA,
    )

    return frame
