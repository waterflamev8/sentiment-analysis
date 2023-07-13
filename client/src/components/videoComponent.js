import React, { useRef, useEffect } from "react";
import { initVideo } from "../utils/videoHelper";

const videoStyles = {
    width: '100%',
    height: '520px',
    objectFit: "cover",
    borderRadius: 10,
    transform: "scaleX(-1)", // Flip the video
};

const canvasStyles = {
    display: "none",
};

const VideoComponent = ({ setEmotionData, setBigEmojiFrame }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        initVideo(videoRef, canvasRef, setEmotionData, setBigEmojiFrame);
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay={true} style={videoStyles} />
            <canvas ref={canvasRef} style={canvasStyles} />
        </div>
    );
};

export default VideoComponent;
