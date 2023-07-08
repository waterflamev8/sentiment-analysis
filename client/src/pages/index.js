import React, { useState, useEffect } from "react";
import Snowfall from 'react-snowfall'
import "../styles/global.css";

import awsLogo from "../images/awsLogo.png";
import VideoComponent from "../components/videoComponent";
import CardComponent from "../components/cardComponent";
import EmotionsComponent from "../components/EmotionsComponent";

const navBarStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "var(--nav)",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    height: 50,
};

const logoContainerStyles = {
    display: "flex",
    alignItems: "center",
};

const awsLogoStyles = {
    width: 80,
    height: 80,
    marginRight: 10,
    marginTop: 5,
};

const logoTextStyles = {
    fontSize: 25,
    color: "var(--text)",
    fontWeight: 400,
    fontFamily: "Roboto, sans-serif",
};

const contentContainerStyles = {
    display: "flex",
    justifyContent: "space-between",
    padding: 40,
};

// const emojiMapping = {
//     'HAPPY': '🙂',
//     'SAD': '😢',
//     'ANGRY': '😡',
//     'CONFUSED': '😕',
//     'DISGUSTED': '🤮',
//     'SURPRISED': '😮',
//     'CALM': '😌',
//     'UNKNOWN': '🤷',
//     'FEAR': '😱'
// };

// function getRandom(min, max) {
//     return Math.random() * (max - min) + min;
// }

const IndexPage = () => {
    const [emotionData, setEmotionData] = useState([]);
//     const [emojis, setEmojis] = useState([]);

//     function calculateEmojis() {
//         const total = emotionData.reduce((acc, curr) => acc + curr[1], 0);
//         const emojis = [];

//         for (const [emotion, count] of emotionData) {
//             const emojiCount = Math.round(count / total * 100);
//             for (let i = 0; i < emojiCount; i++) {
//                 emojis.push(emojiMapping[emotion]);
//             }
//         }

//         return emojis;
//     }

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (emojis.length < 10) {
//                 const newEmojis = calculateEmojis();
//                 setEmojis((emojis) => [...emojis, ...newEmojis]);
//             }
//         }, 100);

//         return () => clearInterval(interval);
//     }, [emotionData]);

    return (
        <div>
            <nav style={navBarStyles}>
                <div style={logoContainerStyles}>
                    <img src={awsLogo} style={awsLogoStyles} alt="AWS Logo" />
                    <span style={logoTextStyles}>Amazon SkillsFuture 2023</span>
                </div>
            </nav>
            <div style={contentContainerStyles}>
                <CardComponent header="Video" width="70%">
                    <VideoComponent setEmotionData={setEmotionData} />
                </CardComponent>
                <CardComponent header="Emotions" width="20%">
                    <EmotionsComponent data={emotionData} />
                </CardComponent>
            </div>
            {/* {emojis.map((emoji, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: `${getRandom(10, 90)}%`,
                        animation: `fall ${getRandom(10, 15)}s linear`,
                        opacity: 0,
                        animationFillMode: 'forwards',
                        fontSize: `${getRandom(50, 100)}px`,
                    }}
                >
                    {emoji}
                </div>
            ))} */}
            <Snowfall
                color="white"
                style={{ 
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh'
                }}
                radius={[10, 20]}
                rotationSpeed={[-1, 1]}
                speed={[1, 3]}
                wind={[-1, 1]}
                snowflakeCount={20}
            />
        </div>
    );
};

export default IndexPage;

export const Head = () => <title>Sentiment Analysis</title>;