import time

import cv2
import boto3

from constants import FRAME_RATE, HEIGHT, TEXT_COLOUR, WIDTH, WINDOW_NAME, REGION
from utils import process_frame


def main():
    session = boto3.Session()
    client = session.client("rekognition", region_name=REGION)

    stream = cv2.VideoCapture(0)

    prev = 0

    while True:
        time_elapsed = time.time() - prev
        success, frame = stream.read()

        # Basic error handling
        if not success:
            print("Error")
            break

        if time_elapsed > 1.0 / FRAME_RATE:
            prev = time.time()

            success, buffer = cv2.imencode(".jpeg", frame)

            if not success:
                print("Error")
                break

            img_bytes = bytearray(buffer)
            response = client.detect_faces(
                Image={"Bytes": img_bytes}, Attributes=["DEFAULT", "EMOTIONS"]
            )
            image = process_frame(frame, response)

            cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)
            cv2.imshow(WINDOW_NAME, image)

        # Handler to quit app
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    # After the loop release the stream object
    stream.release()

    # Destroy all the windows
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
