import React, { useState } from "react";
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

const IndexPage = () => {
    const [emotionData, setEmotionData] = useState([]);

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
        </div>
    );
};

export default IndexPage;

export const Head = () => <title>Sentiment Analysis</title>;
