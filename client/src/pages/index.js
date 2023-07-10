import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import Snowfall from 'react-snowfall'
import "../styles/global.css";

import awsLogo from "../images/awsLogo.png";
import VideoComponent from "../components/videoComponent";
import CardComponent from "../components/cardComponent";
import EmotionsComponent from "../components/EmotionsComponent";

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

const cooldownTextStyles = {
    color: "var(--text)", 
    fontSize: 25, 
    marginRight: 10 
}

const contentContainerStyles = {
    display: "flex",
    justifyContent: "space-between",
    padding: 40,
};

const fadeInOut = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

const IndexPage = () => {
    const [emotionData, setEmotionData] = useState({});

    const [canTriggerBigEmoji, setCanTriggerBigEmoji] = useState(true);
    const [showingBigEmoji, setShowingBigEmoji] = useState(false);
    const [bigEmojiImage, setBigEmojiImage] = useState(new Image());

    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        TriggerBigEmoji();
    }, [emotionData]);

    useEffect(() => {
        console.log ("canTriggerBigEmoji", canTriggerBigEmoji)
    }, [canTriggerBigEmoji]);

    useEffect(() => {
        console.log ("showingBigEmoji", showingBigEmoji)
    }, [showingBigEmoji]);

    const TriggerBigEmoji = () => {
        if (canTriggerBigEmoji && emotionData.big_emotion && emotionData.big_emotion !== "CALM") {
            console.log ("emotionData.big_emotion", emotionData.big_emotion)

            let newImage = new Image();
            newImage.src = getImage(emotionData, bigEmojiImage);
            setBigEmojiImage(newImage);
    
            setShowingBigEmoji(true);
            setTimeout(() => { setShowingBigEmoji(false); }, 5000);
    
            setCanTriggerBigEmoji(false);
            setCooldown(10);
            setTimeout(() => { setCanTriggerBigEmoji(true); }, 10000);
        }
    }

    useEffect(() => {
        if (cooldown > 0) {
            const id = setInterval(() => setCooldown(cooldown - 1), 1000);
            return () => clearInterval(id);
        }
      }, [cooldown]);

    return (
        <div>
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
                    <VideoComponent setEmotionData={setEmotionData} />
                </CardComponent>
                <CardComponent header="Emotions" width="25%">
                    <EmotionsComponent data={emotionData} />
                </CardComponent>
            </div>
            <AnimatePresence>
                {showingBigEmoji && (
                    <motion.div
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
                                height: '100vh'
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
