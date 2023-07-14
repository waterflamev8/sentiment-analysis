import axios from "axios"
import { dataURLToBlob } from "../api/imageFuncs";

export async function sendFrame(videoRef, canvasRef, setEmotionData, setBigEmojiFrame, canTriggerBigEmoji) {
    if(videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const frame = canvasRef.current.toDataURL('image/jpeg', 1.0);
        const imageBlob = dataURLToBlob(frame); // Convert the frame to a Blob

        try {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = async function() {
                const base64data = reader.result;

                const response = await axios.post(`/process`, { frame: base64data }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                setEmotionData(response.data);

                const hasBigEmotion = response.data.big_emotion && response.data.big_emotion !== "CALM";

                if (hasBigEmotion && canTriggerBigEmoji) 
                {
                    const frame = canvasRef.current.toDataURL('image/jpeg', 1.0);
                    setBigEmojiFrame(frame); 
                }
            }
        } catch(error) {
            console.error("Error: ", error);
        }
    }
}

export async function initVideo(videoRef, canvasRef, setEmotionData, setBigEmojiFrame, canTriggerBigEmoji) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                videoRef.current.srcObject = stream;

                setInterval(() => {
                    sendFrame(videoRef, canvasRef, setEmotionData, setBigEmojiFrame, canTriggerBigEmoji);
                }, 2000);
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    }
}