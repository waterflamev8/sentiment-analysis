import React, { useRef, useEffect } from "react";
import { initVideo } from "../utils/videoHelper";

const videoStyles = {
    width: '100%',
    height: '100%',
    // objectFit: "cover",
    transform: "scaleX(-1)", // Flip the video
};

const canvasStyles = {
    display: "none",
};

const VideoComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        initVideo(videoRef, canvasRef, formRef);
    }, []);

    return (
        <div>
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
