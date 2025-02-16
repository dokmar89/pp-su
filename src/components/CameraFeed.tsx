// src/components/CameraFeed.tsx
import React, { useEffect, useRef, useState } from 'react';
import Notification from './ui/Notification';
import * as faceapi from 'face-api.js';

const CameraFeed: React.FC<{ onFaceDetected?: (imageData: Blob) => void }> = ({ onFaceDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        // Další modely, pokud jsou potřeba: faceapi.nets.faceLandmark68Net, faceapi.nets.faceRecognitionNet, atd.
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading face-api models:", err);
        setError("Chyba při načítání modelů detekce obličeje.");
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        setError("Nepodařilo se získat přístup ke kameře.");
      }
    };

    startCamera();

    return () => {
      cameraStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const detectFace = async () => {
      if (!modelsLoaded || !videoRef.current || !canvasRef.current) {
        animationFrameId = requestAnimationFrame(detectFace);
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);
      
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
      
      // Vymazání canvasu a vykreslení oválu
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Vykreslení oválu ve středu
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 4;
        context.strokeStyle = "rgba(255, 255, 255, 0.8)";
        context.lineWidth = 4;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
      }

      // Pokud naleznete alespoň jeden obličej, zavolejte callback onFaceDetected jednou
      if (detections.length > 0 && onFaceDetected) {
        // Převod aktuálního snímku z videa na Blob
        canvas.toBlob((blob) => {
          if (blob) {
            onFaceDetected(blob);
          }
        }, "image/jpeg");
        // Pro tento příklad voláme callback pouze jednou – v produkci můžete spouštět periodickou detekci
      }
      animationFrameId = requestAnimationFrame(detectFace);
    };

    animationFrameId = requestAnimationFrame(detectFace);
    return () => cancelAnimationFrame(animationFrameId);
  }, [modelsLoaded, onFaceDetected]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {error && <Notification type="error" message={error} />}
      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", borderRadius: "8px" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
};

export default CameraFeed;
