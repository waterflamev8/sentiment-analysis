import cv2

from constants import HEIGHT, FONT, WIDTH, TEXT_COLOUR


def find_emotion(emotions):
    num = {"Confidence": 0.0, "Type": None}

    for emotion in emotions:
        if emotion["Confidence"] > num["Confidence"]:
            num = emotion

    return num


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
        y1 = y1 - 15 if y1 - 15 > 15 else y1 + 15

        cv2.putText(
            frame, emotion, (x2 + 40, y1 + 240), FONT, 2, TEXT_COLOUR, 1, cv2.LINE_AA
        )

    return frame
