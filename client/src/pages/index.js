import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import axios from "axios"
import { dataURLToBlob } from "../api/imageFuncs";
import Snowfall from 'react-snowfall'
import "../styles/global.css";

import awsLogo from "../images/awsLogo.png";
import VideoComponent from "../components/videoComponent";
import CardComponent from "../components/cardComponent";
import EmotionsComponent from "../components/EmotionsComponent";
import BigEmojiPanel from "../components/bigEmojiPanel";

import angryEmoji from "../images/angryEmoji.svg";
import calmEmoji from "../images/calmEmoji.svg";
import confusedEmoji from "../images/confusedEmoji.svg";
import disgustedEmoji from "../images/disgustedEmoji.svg";
import fearEmoji from "../images/fearEmoji.svg";
import happyEmoji from "../images/happyEmoji.svg";
import sadEmoji from "../images/sadEmoji.svg";
import surprisedEmoji from "../images/surprisedEmoji.svg";
import unknownEmoji from "../images/unknownEmoji.svg";

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

const cooldownTextStyles = {
    color: "var(--text)",
    fontSize: 25,
    marginRight: 10
}

const fadeInOut = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
};

const IndexPage = () => {
    const [emotionData, setEmotionData] = useState({});

    const [canTriggerBigEmoji, setCanTriggerBigEmoji] = useState(true);
    const [showingBigEmoji, setShowingBigEmoji] = useState(false);
    const [bigEmojiImage, setBigEmojiImage] = useState(new Image());

    const [bigEmojiFrame, setBigEmojiFrame] = useState(null); 
    const [qrCodeImage, setQrCodeImage] = useState(null);

    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        console.log ("canTriggerBigEmoji", canTriggerBigEmoji)
    }, [canTriggerBigEmoji]);

    useEffect(() => {
        console.log ("showingBigEmoji", showingBigEmoji)
    }, [showingBigEmoji]);

    useEffect(() => {
        if (canTriggerBigEmoji && bigEmojiFrame) {
            console.log ("HAS BIG EMOTION, GETTING QR CODE")
            const triggerBigEmoji = async () => 
            {
                setCanTriggerBigEmoji(false);
    
                const qrCode = await getQrCode(bigEmojiFrame);
                setQrCodeImage(qrCode);
                
                let newImage = new Image();
    
                newImage.onload = () => {
                    setBigEmojiImage(newImage);
                    setShowingBigEmoji(true);
                    setTimeout(() => { setShowingBigEmoji(false); }, 5000);
                }
    
                newImage.src = getImage(emotionData);
    
                setCooldown(12);
                setTimeout(() => { setCanTriggerBigEmoji(true); }, 12000);
            }
    
            triggerBigEmoji();
        }
    }, [bigEmojiFrame]);     

    useEffect(() => {
        if (cooldown > 0) {
            const id = setInterval(() => setCooldown(cooldown - 1), 1000);
            return () => clearInterval(id);
        }
      }, [cooldown]);

    return (
        <div style={{position: "relative"}}>
              <AnimatePresence>
            {showingBigEmoji && (
                <motion.div
                    style={{position: "absolute", zIndex: 2}}
                    variants={fadeInOut}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                >
                    <Snowfall
                        color="white"
                        style={{ 
                            position: 'fixed',
                            width: '100vw',
                            height: '100vh',
                        }}
                        radius={[50, 400]}
                        rotationSpeed={[-1, 1]}
                        speed={[20, 40]}
                        wind={[-0.5, 2]}
                        snowflakeCount={20}
                        images={[bigEmojiImage]} 
                    />
                </motion.div>
            )}
        </AnimatePresence>
        
        <AnimatePresence>
            { !canTriggerBigEmoji && ( 
                <motion.div
                    style={{position: "absolute", zIndex: 1}}
                    variants={fadeInOut}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                >
                    <BigEmojiPanel
                        frameImage={bigEmojiFrame} 
                        qrCodeImage={qrCodeImage} 
                        timer={cooldown} 
                    />
                </motion.div>
            )}
        </AnimatePresence>

            <nav style={navBarStyles}>
                <div style={logoContainerStyles}>
                    <img src={awsLogo} style={awsLogoStyles} alt="AWS Logo" />
                    <span style={logoTextStyles}>Amazon SkillsFuture 2023</span>
                </div>
                <div>
                    <span style={cooldownTextStyles}>{cooldown > 0 ? `Cooldown: ${cooldown}` : "READY!"}</span>
                </div>
            </nav>
            <div style={contentContainerStyles}>
                <CardComponent header="Video" width="75%">
                    <VideoComponent setEmotionData={setEmotionData} setBigEmojiFrame={setBigEmojiFrame} canTriggerBigEmoji={canTriggerBigEmoji} />
                </CardComponent>
                <CardComponent header="Emotions" width="25%">
                    <EmotionsComponent data={emotionData} />
                </CardComponent>
            </div>
        </div>
    );
};

export default IndexPage;

export const Head = () => <title>Sentiment Analysis</title>;

const getImage = (emotionData) =>
{
    switch (emotionData.big_emotion) {
        case "ANGRY":
            return angryEmoji;
        case "CALM":
            return calmEmoji;
        case "CONFUSED":
            return confusedEmoji;
        case "DISGUSTED":
            return disgustedEmoji;
        case "FEAR":
            return fearEmoji;
        case "HAPPY":
            return happyEmoji;
        case "SAD":
            return sadEmoji;
        case "SURPRISED":
            return surprisedEmoji;
        default:
            return unknownEmoji;
    }
}

export async function getQrCode(frame) {
    const imageBlob = dataURLToBlob(frame); // Convert the frame to a Blob

    try {
        const csrfRes = await axios.get("http://localhost:8000/api/generate_csrf_token");
        const csrfToken = csrfRes.data.csrf_token;

        const formData = new FormData();
        formData.append('image', imageBlob, 'image.jpeg');

        const response = await axios.post("http://localhost:8000/api/generate_qr_code", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRFToken': csrfToken
            },
            withCredentials: true
        });

        return response.data.image; 
    } catch(error) {
        console.error("Error: ", error);
    }
}