import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Clock,
  Award,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { usePatient } from '../../hooks/usePatients';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, error, patientData, upcomingExercises, exerciseHistory } = usePatient();

  const stats = [
    {
      id: 'weekly-progress',
      label: 'Weekly Progress',
      value: '0%',
      icon: <Activity className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'total-minutes',
      label: 'Total Minutes',
      value: '0',
      icon: <Clock className="w-5 h-5" />,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'average-score',
      label: 'Average Score',
      value: '0%',
      icon: <Activity className="w-5 h-5" />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'current-streak',
      label: 'Current Streak',
      value: '0 days',
      icon: <Award className="w-5 h-5" />,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const recentActivity = [
    {
      date: new Date(),
      score: 85,
      type: 'exercise',
      name: 'Knee Flexion'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {patientData?.firstName || 'jav'}!
          </h1>
          <p className="mt-2 text-blue-100">
            Let's continue your recovery journey
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.iconColor}>{stat.icon}</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Exercises */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Today's Exercises</h2>
                  <button
                    onClick={() => navigate('/patient/exercises')}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {upcomingExercises && upcomingExercises.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/patient/exercise/${exercise.id}`)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{exercise.duration} mins</span>
                              <span className="mx-2">•</span>
                              <span>{exercise.sets} sets</span>
                              <span className="mx-2">•</span>
                              <span>{exercise.reps} reps</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No exercises scheduled for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Activity className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.name}
                          </p>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <span>{format(activity.date, 'MMM d, yyyy')}</span>
                            <span className="mx-2">•</span>
                            <span>Score: {activity.score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 