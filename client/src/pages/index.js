import React, { useEffect } from "react";
import axios from "axios";
import "../styles/global.css";

import awsLogo from '../images/awsLogo.png'; 
import { initVideo } from "../utils/videoHelper"; 

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

const languageTextStyles = {
    fontSize: 25,
    color: "var(--text)",
    fontWeight: 400,
    marginRight: 10,
    fontFamily: "Roboto, sans-serif",
};

const videoStyles = {
    position: 'fixed', 
    width: '100%', 
    height: 'calc(100% - 70px)', 
    objectFit: 'cover', 
    top: 70,
    transform: 'scaleX(-1)' // Flip the video
};

const canvasStyles = {
    display: 'none',
    width: 640, 
    height: 480
};

const IndexPage = () => {
    const videoRef = React.useRef();
    const canvasRef = React.useRef();

    useEffect(() => {
        initVideo(videoRef, canvasRef);
    }, []);

    return (
        <div>
            <nav style={navBarStyles}>
                <div style={logoContainerStyles}>
                    <img src={awsLogo} style={awsLogoStyles} alt="AWS Logo" /> 
                    <span style={logoTextStyles}>Amazon SkillsFuture 2023</span>
                </div>
                <div style={languageTextStyles}>English 🇬🇧</div>
            </nav>
            <video ref={videoRef} autoPlay={true} style={videoStyles}></video>
            <canvas ref={canvasRef} style={canvasStyles}></canvas>
        </div>
    );
};

export default IndexPage;

export const Head = () => <title>Sentiment Analysis</title>;