# Sentiment Analysis

## Project Overview

Welcome to our sentiment analysis project created for the Vivo City Amazon SkillsFuture Event, 2023! We're excited to showcase our project that employs AWS (Amazon Web Services) AI/ML (Artificial Intelligence/Machine Learning) services for live sentiment analysis. Our AI tool uses AWS Rekognition service to perform sentiment analysis on a group of people. 

This project includes an interactive web interface built with Gatsby React for the frontend, and Flask for the backend. The interface displays video feed and processed emotions in real-time. 

AWS Rekognition processes the video feed and identifies various emotions from the facial expressions of the people in the video. It then returns the emotions to our Flask backend which processes the data and sends it to our React frontend. The frontend then updates the displayed emotions in real-time. 😄😲😕😡😞

## Project Features

- **Real-time Sentiment Analysis**: Our project uses AWS Rekognition to analyze the video feed and identify various emotions in real-time.
- **Interactive Web Interface**: The web interface built with Gatsby React displays the video feed and the processed emotions simultaneously. This provides an interactive visual feedback for the users.
- **AWS Integration**: The project showcases effective utilization of various AWS services, mainly AWS Rekognition.
- **Backend Processing**: We have used Flask for backend processing which communicates with AWS Rekognition service and the frontend.
- **Scalability**: The system is designed to process the emotions of a group of people simultaneously, demonstrating its scalability.

## How It Works

1. The web interface captures video feed of the group of people.
2. This feed is processed by AWS Rekognition to identify different emotions based on facial expressions.
3. The identified emotions are then returned to the Flask backend which processes the data.
4. The backend then communicates with the React frontend to update the displayed emotions in real-time.
5. As a result, the users can see their identified emotions updated live on the web interface.

## Getting Started

To use this project, you will need an AWS account to access AWS Rekognition services. You also need to have Gatsby and Flask setup on your system. You can clone the project from our GitHub repository and follow the instructions in the setup guide to get started.

## License

This project is licensed under the terms of the [MIT license](LICENSE).
