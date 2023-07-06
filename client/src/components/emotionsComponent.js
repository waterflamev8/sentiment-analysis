import React from "react";

const sentimentStyles = {
    padding: "0px 60px",
    marginTop: 30,
    marginBottom: 30,
    color: "var(--text)",
    textAlign: "center",
    fontSize: 20,
};

const emojiStyles = {
    fontSize: 30,
};

const emojiMapping = {
    'HAPPY': '😀',
    'SAD': '😢',
    'ANGRY': '😠',
    'CONFUSED': '😕',
    'DISGUSTED': '🤮',
    'SURPRISED': '😮',
    'CALM': '😌',
    'UNKNOWN': '🤷',
    'FEAR': '😱'
};  

const EmotionsComponent = ({ data }) => {
    return (
        <div>
            {data.result.map(([sentiment, value], index) => (
                <div key={index} style={sentimentStyles}>
                    <div style={emojiStyles}>{emojiMapping[sentiment]} x{value}</div>
                </div>
            ))}
        </div>
    );
};

export default EmotionsComponent;
