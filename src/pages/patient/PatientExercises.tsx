import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Clock,
  Calendar,
  Target,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  ArrowRight,
  Dumbbell
} from 'lucide-react';
import { usePatient } from '../../hooks/usePatients';
import { format } from 'date-fns';
import { Exercise, ExerciseHistory } from '../../types/patient';

const PatientExercises = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { loading, error, upcomingExercises, exerciseHistory } = usePatient();

  const filterTypes = [
    { id: 'all', label: 'All' },
    { id: 'Mobility', label: 'Mobility' },
    { id: 'Strength', label: 'Strength' },
    { id: 'Balance', label: 'Balance' }
  ];

  const filteredExercises = upcomingExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || exercise.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-900">{error}</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Hub</h1>
              <p className="text-gray-600">Track your exercises and monitor progress</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/exercise/new')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center group"
              >
                <Play className="w-5 h-5 mr-2" />
                Start New Exercise
                <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {filterTypes.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${selectedFilter === filter.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer transform hover:-translate-y-1 transition-transform duration-200"
              onClick={() => navigate(`/exercise/${exercise.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{exercise.name}</h3>
                  <p className="text-gray-600 mt-1">{exercise.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${exercise.type === 'Mobility' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                  {exercise.type}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{exercise.duration}</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{`${exercise.sets || 0} sets`}</span>
                </div>
                <div className="flex items-center">
                  <Dumbbell className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{`${exercise.reps || 0} reps`}</span>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[150px]">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${exercise.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{exercise.progress}% Complete</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Exercise History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Exercise History</h2>
          <div className="space-y-4">
            {exerciseHistory.map((history) => (
              <div
                key={history.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CheckCircle2 className={`w-8 h-8 ${getScoreColor(history.score)}`} />
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-900">{history.exerciseName}</h3>
                    <span className={`font-semibold ${getScoreColor(history.score)}`}>
                      {history.score}%
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{format(history.date, 'MMM d, yyyy')}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{history.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientExercises;
