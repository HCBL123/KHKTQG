import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const DoctorAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const q = query(collection(db, 'appointments'));
      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: newStatus
      });
      
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc hẹn này?')) {
      try {
        await deleteDoc(doc(db, 'appointments', appointmentId));
        setAppointments(appointments.filter(apt => apt.id !== appointmentId));
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleAppointmentSuccess = () => {
    fetchAppointments();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen pt-16">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lịch Hẹn</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Thêm Lịch Hẹn Mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bệnh nhân
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giờ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.patientName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {appointment.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {appointment.time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                    className="text-sm rounded-full px-3 py-1"
                    style={{
                      backgroundColor: 
                        appointment.status === 'completed' ? '#DEF7EC' :
                        appointment.status === 'cancelled' ? '#FDE8E8' : '#E1EFFE',
                      color:
                        appointment.status === 'completed' ? '#03543F' :
                        appointment.status === 'cancelled' ? '#9B1C1C' : '#1E429F'
                    }}
                  >
                    <option value="scheduled">Đã lên lịch</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onSuccess={handleAppointmentSuccess}
      />
    </div>
  );
};

export default DoctorAppointmentsPage; 