import React, { useState } from 'react';
import TimeStatistics from '../dashbordComponent/timeStatistics.jsx'; // Adjust path as needed
import TimeTable from './timeOverviewComponents/timeTable.jsx'; // Adjust path as needed
import { motion } from 'framer-motion';

const TimeManagementOverview = () => {
  // State for schedules and statistics
  const [schedules, setSchedules] = useState([]);
  const [timeStats, setTimeStats] = useState({
    scheduled: 0,
    completed: 0,
    pending: 0,
    locations: 0,
  });

  // State for new schedule form, including wasteType
  const [newSchedule, setNewSchedule] = useState({
    id: '',
    date: '',
    time: '',
    location: '',
    wasteType: '', // Added wasteType
    status: 'pending',
  });

  // State for error messages
  const [errors, setErrors] = useState({});

  // CREATE: Add new schedule
  const handleCreateSchedule = () => {
    let formErrors = {};
    if (!newSchedule.date) formErrors.date = 'Date is required';
    if (!newSchedule.time) formErrors.time = 'Time is required';
    if (!newSchedule.location) formErrors.location = 'Location is required';
    if (!newSchedule.wasteType) formErrors.wasteType = 'Waste Type is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop if there are errors
    }

    const scheduleWithId = {
      ...newSchedule,
      id: Date.now().toString(), // Simple unique ID generation
    };

    const updatedSchedules = [...schedules, scheduleWithId];
    setSchedules(updatedSchedules);
    updateStats(updatedSchedules);

    // Reset form and clear errors
    setNewSchedule({
      id: '',
      date: '',
      time: '',
      location: '',
      wasteType: '',
      status: 'pending',
    });
    setErrors({});
  };

  // READ: Update statistics based on schedules
  const updateStats = (updatedSchedules) => {
    setTimeStats({
      scheduled: updatedSchedules.length,
      completed: updatedSchedules.filter(s => s.status === 'completed').length,
      pending: updatedSchedules.filter(s => s.status === 'pending').length,
      locations: new Set(updatedSchedules.map(s => s.location)).size,
    });
  };

  // UPDATE: Edit existing schedule
  const handleEditSchedule = (updatedSchedule) => {
    const updatedSchedules = schedules.map(schedule =>
      schedule.id === updatedSchedule.id ? updatedSchedule : schedule
    );
    setSchedules(updatedSchedules);
    updateStats(updatedSchedules);
  };

  // DELETE: Remove schedule
  const handleDeleteSchedule = (scheduleToDelete) => {
    const updatedSchedules = schedules.filter(
      schedule => schedule.id !== scheduleToDelete.id
    );
    setSchedules(updatedSchedules);
    updateStats(updatedSchedules);
  };

  // UPDATE: Approve schedule
  const handleApproveSchedule = (schedule) => {
    const updatedSchedules = schedules.map(s =>
      s.id === schedule.id ? { ...s, status: 'completed' } : s
    );
    setSchedules(updatedSchedules);
    updateStats(updatedSchedules);
  };

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
    // Clear the error message for the field being changed
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Waste Collection Schedule Management</h1>

      {/* Time Statistics Cards */}
      <TimeStatistics stats={timeStats} />

      {/* Create New Schedule Form */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <input
              type="date"
              name="date"
              value={newSchedule.date}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors.date ? 'border-red-500' : ''}`}
              placeholder="Date"
            />
            {errors.date && <p className="text-red-500 text-xs mt-1 absolute left-0 -bottom-5">{errors.date}</p>}
          </div>
          <div className="relative">
            <input
              type="time"
              name="time"
              value={newSchedule.time}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors.time ? 'border-red-500' : ''}`}
              placeholder="Time"
            />
            {errors.time && <p className="text-red-500 text-xs mt-1 absolute left-0 -bottom-5">{errors.time}</p>}
          </div>
          <div className="relative">
            <input
              type="text"
              name="location"
              value={newSchedule.location}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors.location ? 'border-red-500' : ''}`}
              placeholder="Location"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1 absolute left-0 -bottom-5">{errors.location}</p>}
          </div>
          <div className="relative">
            <select
              name="wasteType"
              value={newSchedule.wasteType}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors.wasteType ? 'border-red-500' : ''}`}
            >
              <option value="">Select Waste Type</option>
              <option value="Organic">Organic</option>
              <option value="Recyclable">Recyclable</option>
              <option value="Hazardous">Hazardous</option>
              <option value="General">General</option>
            </select>
            {errors.wasteType && <p className="text-red-500 text-xs mt-1 absolute left-0 -bottom-5">{errors.wasteType}</p>}
          </div>
          <button
            onClick={handleCreateSchedule}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Schedule
          </button>
        </div>
      </div>

      {/* Schedule Table Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Collection Schedules</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Generate Weekly Plan
          </button>
        </div>
        <TimeTable
          schedules={schedules}
          onDelete={handleDeleteSchedule}
          onEdit={handleEditSchedule}
          onApprove={handleApproveSchedule}
        />
      </div>

      {/* Bulk Operations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-white shadow-lg rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Bulk Operations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-400 text-white px-4 py-3 rounded-lg hover:bg-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
          >
            Reschedule Pending
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
          >
            Assign Collection Teams
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const updatedSchedules = schedules.filter(s => s.status !== 'pending');
              setSchedules(updatedSchedules);
              updateStats(updatedSchedules);
            }}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
          >
            Cancel All Pending
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-700 text-white px-4 py-3 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
          >
            Export Schedule
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeManagementOverview;
