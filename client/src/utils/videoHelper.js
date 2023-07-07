import axios from "axios"

function dataURLToBlob(dataURL) 
{
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
        const parts = dataURL.split(',');
        const contentType = parts[0].split(':')[1];
        const raw = decodeURIComponent(parts[1]);

        return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

export async function sendFrame(videoRef, canvasRef) {
    if(videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const frame = canvasRef.current.toDataURL('image/jpeg', 1.0);
        const imageBlob = dataURLToBlob(frame); // Convert the frame to a Blob

        try {
            const csrfRes = await axios.get("http://localhost:8000/api/generate_csrf_token");
            const csrfToken = csrfRes.data.csrf_token;

            const formData = new FormData();
            formData.append('image', imageBlob, 'image.jpeg');

            const response = await axios.post("http://localhost:8000/api/process", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            });

            console.log(response.data);
        } catch(error) {
            console.error("Error: ", error);
        }
    }
}

export async function initVideo(videoRef, canvasRef) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                videoRef.current.srcObject = stream;

                setInterval(() => {
                    sendFrame(videoRef, canvasRef);
                }, 1000);             
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    }
}
