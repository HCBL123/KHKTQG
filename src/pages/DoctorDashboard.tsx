// src/pages/DoctorDashboard.tsx
import { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Activity,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';

// Mock data - replace with real data from your backend
const mockPatients = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    condition: 'Post-surgery Recovery',
    progress: 75,
    nextSession: 'Today, 2:00 PM',
    status: 'On Track'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    condition: 'Shoulder Rehabilitation',
    progress: 60,
    nextSession: 'Tomorrow, 10:00 AM',
    status: 'Needs Attention'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    age: 28,
    condition: 'Sports Injury',
    progress: 90,
    nextSession: 'Today, 4:00 PM',
    status: 'Excellent'
  },
];

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Today's Sessions</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Average Progress</p>
              <p className="text-2xl font-bold text-gray-900">75%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Patients</h2>
          <div className="space-y-4">
            {mockPatients.map((patient) => (
              <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <span className="mr-4">{patient.age} years</span>
                      <span>{patient.condition}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm text-gray-600">Progress: {patient.progress}%</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm text-gray-600">{patient.nextSession}</span>
                    </div>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${patient.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                      patient.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            View All Patients
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
