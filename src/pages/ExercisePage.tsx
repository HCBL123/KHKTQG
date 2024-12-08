import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Camera, RotateCcw } from "lucide-react";
import { useWebcam } from "../hooks/useWebcam";
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const ExercisePage = () => {
  const { id } = useParams();
  const [isStarted, setIsStarted] = useState(false);
  const { videoRef, hasPermission, error, startWebcam, stopWebcam } = useWebcam();
  const exerciseVideoRef = useRef<HTMLVideoElement>(null);
  const webcamCanvasRef = useRef<HTMLCanvasElement>(null);
  const exerciseCanvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);

  useEffect(() => {
    const initPoseDetection = async () => {
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
      };
      const detector = await poseDetection.createDetector(model, detectorConfig);
      setDetector(detector);
    };

    initPoseDetection();
  }, []);

  const drawPose = (
    poses: poseDetection.Pose[],
    canvas: HTMLCanvasElement | null,
    videoElement: HTMLVideoElement | null,
    flipHorizontal = false
  ) => {
    if (!canvas || !videoElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to match video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    if (flipHorizontal) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Draw keypoints
    poses.forEach(pose => {
      pose.keypoints.forEach(keypoint => {
        if (keypoint.score && keypoint.score > 0.3) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      });

      // Draw connections
      const connections = poseDetection.util.getAdjacentPairs(model);
      connections.forEach(([i, j]) => {
        const kp1 = pose.keypoints[i];
        const kp2 = pose.keypoints[j];

        if (kp1.score && kp2.score && kp1.score > 0.3 && kp2.score > 0.3) {
          ctx.beginPath();
          ctx.moveTo(kp1.x, kp1.y);
          ctx.lineTo(kp2.x, kp2.y);
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'red';
          ctx.stroke();
        }
      });
    });

    if (flipHorizontal) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  };

  useEffect(() => {
    if (isStarted && detector) {
      const interval = setInterval(async () => {
        if (videoRef.current) {
          const poses = await detector.estimatePoses(videoRef.current);
          drawPose(poses, webcamCanvasRef.current, videoRef.current, true);
        }
        if (exerciseVideoRef.current) {
          const poses = await detector.estimatePoses(exerciseVideoRef.current);
          drawPose(poses, exerciseCanvasRef.current, exerciseVideoRef.current);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isStarted, detector]);

  const handlePlayPause = () => {
    if (isStarted) {
      stopWebcam();
      if (exerciseVideoRef.current) {
        exerciseVideoRef.current.pause();
      }
    } else {
      startWebcam();
      if (exerciseVideoRef.current) {
        exerciseVideoRef.current.play();
      }
    }
    setIsStarted(!isStarted);
  };

  const handleReset = () => {
    if (exerciseVideoRef.current) {
      exerciseVideoRef.current.currentTime = 0;
      exerciseVideoRef.current.pause();
    }
    stopWebcam();
    setIsStarted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-full">
        <div className="w-1/2 h-screen relative">
          {isStarted ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              <canvas
                ref={webcamCanvasRef}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <Camera className="w-16 h-16" />
            </div>
          )}
        </div>
        <div className="w-1/2 h-screen relative">
          <video
            ref={exerciseVideoRef}
            src="/assets/videos/abc.mp4"
            loop
            className="w-full h-full object-cover"
          />
          <canvas
            ref={exerciseCanvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-center space-x-4">
            <button
              className="p-4 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={handlePlayPause}
            >
              {isStarted ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button 
              className="p-4 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={handleReset}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;