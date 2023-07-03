import axios from "axios";

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

export async function initVideo(videoRef, canvasRef, formRef) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                videoRef.current.srcObject = stream;

                setInterval(async () => {
                    if(videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) 
                    {
                        fetch('http://127.0.0.1:3000/generate_csrf_token')
                            .then((res) => {
                                return res.json();
                            })
                            .then(({ csrf_token }) => {
                                canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0, 640, 480);
                                const frame = canvasRef.current.toDataURL('image/jpeg', 1.0);
                                const imageBlob = dataURLToBlob(frame); // Convert the frame to a Blob

                                const formData = new FormData();
                                formData.append('image', imageBlob, 'image.jpg');
                                formData.append('csrf_token', csrf_token);

                                return fetch('http://127.0.0.1:3000/process', {
                                    method: 'POST',
                                    body: formData
                                });
                            })
                            .then((res) => {
                                return res.json();
                            })
                            .then((data) => {
                                console.log(data);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                }, 1000);             
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    }
}