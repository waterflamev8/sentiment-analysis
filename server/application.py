import os

from dotenv import load_dotenv

from app import app as application

if __name__ == "__main__":
    load_dotenv()  # Initialise environment variables

    application.run(host=os.getenv("HTTP_HOST"), port=os.getenv("HTTP_PORT"))