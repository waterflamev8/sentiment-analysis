import React from "react";
import CardComponent from "./cardComponent";

const BigEmojiPanel = ({ frameImage, qrCodeImage, timer }) => {
    const styles = {
        panel: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // zIndex: 5,
            flexDirection: "column",
        },
        content: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        frameImage: {
            transform: "scaleX(-1)",
            width: '100%',
            height: '520px',
            objectFit: "cover",
            borderRadius: 10,
        },
        qrCodeImage: {
            width: '100%',
            height: '520px',
            objectFit: "cover",


            borderRadius: 10,
        },

        cooldownTextStyles: {
            color: "var(--text)", 
            fontSize: 45, 
        }
    };

    console.log ("LOOK HERE")
    console.log (qrCodeImage)

    return (
        <div style={styles.panel}>
            <p style={styles.cooldownTextStyles}>Counting: {timer}</p>
            <div style={styles.content}>
                <CardComponent header="Frame" width="75%">
                    <img src={frameImage} alt="Big Emoji" style={styles.frameImage} />
                </CardComponent>
                <CardComponent header="QR Code" width="670px">
                    <img src={`data:image/png;base64,${qrCodeImage}`} alt="QR Code" style={styles.qrCodeImage} />
                </CardComponent>
            </div>
        </div>
    );
};

export default BigEmojiPanel;
