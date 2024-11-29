// src/pages/ExercisePage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Camera, RotateCcw } from 'lucide-react';

const ExercisePage = () => {
  const { id } = useParams();
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Exercise Video Feed */}
      <div className="relative h-[60vh] bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-16 h-16 text-gray-500" />
          <p className="text-gray-500 mt-4">Camera feed will appear here</p>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-center space-x-4">
            <button
              className="p-4 rounded-full bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => setIsStarted(!isStarted)}
            >
              {isStarted ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button className="p-4 rounded-full bg-white text-gray-900 hover:bg-gray-100">
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Information */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Exercise Name (ID: {id})
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Sets Remaining</h3>
              <p className="text-2xl font-bold text-blue-600">3/5</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Current Score</h3>
              <p className="text-2xl font-bold text-green-600">85%</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Time Elapsed</h3>
              <p className="text-2xl font-bold text-purple-600">05:30</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
              <p className="text-gray-600">
                1. Stand straight with your feet shoulder-width apart<br />
                2. Slowly raise your arms to shoulder height<br />
                3. Hold for 5 seconds<br />
                4. Lower your arms back to starting position<br />
                5. Repeat for the specified number of sets
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tips</h3>
              <ul className="text-gray-600 list-disc list-inside">
                <li>Keep your back straight throughout the exercise</li>
                <li>Breathe steadily and naturally</li>
                <li>Stop if you feel any pain or discomfort</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
