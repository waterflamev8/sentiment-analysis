import React, { useRef, useEffect } from "react";
import { initVideo } from "../utils/videoHelper";

const videoStyles = {
    width: '100%',
    height: '520px',
    objectFit: "cover",
    borderRadius: 10,
    transform: "scaleX(-1)", // Flip the video
    // vertically align with parent div
};

const canvasStyles = {
    display: "none",
};

const VideoComponent = ({ setEmotionData }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        initVideo(videoRef, canvasRef, formRef, setEmotionData);
    }, []);

    return (
        <div>
            {/* width of video should be 100% */}
            <video ref={videoRef} autoPlay={true} style={videoStyles} />
            <canvas ref={canvasRef} style={canvasStyles} />

            <form ref={formRef} style={{ display: "none" }}>
                <input
                    type="hidden"
                    id="csrf_token"
                    name="csrf_token"
                    value=""
                />
            </form>
        </div>
    );
};

export default VideoComponent;
