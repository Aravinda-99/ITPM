import React, { useState } from 'react';
import { MapPin, Trash2, Edit, Plus, X, Save, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Initial mock data
const initialLocations = [
  { id: 1, latitude: 6.927079, longitude: 79.861244, address: "Colombo Fort, Colombo", wasteType: "organic", status: "half-full", lastUpdated: "2024-03-15 10:30" },
  { id: 2, latitude: 6.914741, longitude: 79.872128, address: "Galle Face Green, Colombo", wasteType: "plastic", status: "empty", lastUpdated: "2024-03-15 09:45" },
  { id: 3, latitude: 6.901691, longitude: 79.856975, address: "Kollupitiya, Colombo", wasteType: "paper", status: "full", lastUpdated: "2024-03-15 11:15" },
  { id: 4, latitude: 6.935821, longitude: 79.850726, address: "Maradana, Colombo", wasteType: "metal", status: "empty", lastUpdated: "2024-03-15 12:00" },
  { id: 5, latitude: 6.906079, longitude: 79.873157, address: "Bambalapitiya, Colombo", wasteType: "plastic", status: "half-full", lastUpdated: "2024-03-15 11:45" }
];

// Utility functions
const getStatusColor = (status) => {
  switch (status) {
    case 'empty': return 'bg-green-100 text-green-800';
    case 'half-full': return 'bg-amber-100 text-amber-800';
    case 'full': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getWasteTypeIcon = (type) => {
  switch (type) {
    case 'organic': return '🌱';
    case 'plastic': return '♻️';
    case 'paper': return '📄';
    case 'metal': return '🔧';
    default: return '🗑️';
  }
};

const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const BinLocationsAdmin = () => {
  const [locations, setLocations] = useState(initialLocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [newLocation, setNewLocation] = useState({
    latitude: '',
    longitude: '',
    address: '',
    wasteType: 'organic',
    status: 'empty',
    lastUpdated: formatDateTime(new Date())
  });
  const [errors, setErrors] = useState({
    latitude: '',
    longitude: '',
    address: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter locations based on search term
  const filteredLocations = locations.filter(location =>
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    const newErrors = { latitude: '', longitude: '', address: '' };

    if (!newLocation.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    if (!newLocation.latitude) {
      newErrors.latitude = 'Latitude is required';
      valid = false;
    } else if (isNaN(newLocation.latitude) || newLocation.latitude < -90 || newLocation.latitude > 90) {
      newErrors.latitude = 'Must be between -90 and 90';
      valid = false;
    }

    if (!newLocation.longitude) {
      newErrors.longitude = 'Longitude is required';
      valid = false;
    } else if (isNaN(newLocation.longitude) || newLocation.longitude < -180 || newLocation.longitude > 180) {
      newErrors.longitude = 'Must be between -180 and 180';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSaveLocation = () => {
    if (!validateForm()) return;

    const updatedLocation = {
      ...newLocation,
      latitude: parseFloat(newLocation.latitude),
      longitude: parseFloat(newLocation.longitude),
      lastUpdated: formatDateTime(new Date())
    };

    if (editingLocation) {
      setLocations(locations.map(loc => 
        loc.id === editingLocation.id ? updatedLocation : loc
      ));
      toast.success('Bin updated successfully!');
    } else {
      setLocations([...locations, {
        ...updatedLocation,
        id: Math.max(...locations.map(loc => loc.id)) + 1
      }]);
      toast.success('Bin added successfully!');
    }

    setIsModalOpen(false);
    setNewLocation({
      latitude: '',
      longitude: '',
      address: '',
      wasteType: 'organic',
      status: 'empty',
      lastUpdated: formatDateTime(new Date())
    });
  };

  const handleDeleteLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
    toast.success('Bin deleted successfully!');
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setNewLocation({
      ...location,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString()
    });
    setIsModalOpen(true);
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setNewLocation({
      latitude: '',
      longitude: '',
      address: '',
      wasteType: 'organic',
      status: 'empty',
      lastUpdated: formatDateTime(new Date())
    });
    setErrors({ latitude: '', longitude: '', address: '' });
    setIsModalOpen(true);
  };

  const statusCounts = {
    empty: locations.filter(loc => loc.status === 'empty').length,
    halfFull: locations.filter(loc => loc.status === 'half-full').length,
    full: locations.filter(loc => loc.status === 'full').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bin Management</h1>
            <p className="text-gray-500 mt-1">Monitor and manage waste collection points</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search bins..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddLocation}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              Add Bin
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            { status: 'empty', count: statusCounts.empty, color: 'emerald', icon: <CheckCircle2 className="text-emerald-600" size={24} /> },
            { status: 'half-full', count: statusCounts.halfFull, color: 'amber', icon: <AlertCircle className="text-amber-500" size={24} /> },
            { status: 'full', count: statusCounts.full, color: 'red', icon: <AlertCircle className="text-red-500" size={24} /> }
          ].map((stat) => (
            <div key={stat.status} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.status.split('-').join(' ')}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-500 mt-1`}>{stat.count}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${stat.color}-500 rounded-full`} 
                  style={{ width: `${(stat.count / locations.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Trash2 className="text-emerald-600" size={20} />
              Bin Locations
              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">
                {filteredLocations.length} bins
              </span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500 font-medium">
                  <th className="p-4">Address</th>
                  <th className="p-4">Coordinates</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getWasteTypeIcon(location.wasteType)}</span>
                          <span>{location.address}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </td>
                      <td className="p-4">
                        <span className="capitalize px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {location.wasteType}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(location.status)}`}>
                          {location.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{location.lastUpdated}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditLocation(location)}
                            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteLocation(location.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No bins found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingLocation ? 'Edit Bin' : 'Add New Bin'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={newLocation.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                    placeholder="Enter address"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                    <input
                      type="number"
                      name="latitude"
                      value={newLocation.latitude}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border ${errors.latitude ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-emerald-500`}
                      placeholder="e.g., 6.927079"
                      step="any"
                      min="-90"
                      max="90"
                    />
                    {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                    <input
                      type="number"
                      name="longitude"
                      value={newLocation.longitude}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border ${errors.longitude ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-emerald-500`}
                      placeholder="e.g., 79.861244"
                      step="any"
                      min="-180"
                      max="180"
                    />
                    {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                  <select
                    name="wasteType"
                    value={newLocation.wasteType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="organic">Organic</option>
                    <option value="plastic">Plastic</option>
                    <option value="paper">Paper</option>
                    <option value="metal">Metal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={newLocation.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="empty">Empty</option>
                    <option value="half-full">Half Full</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              </div>
              
              <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLocation}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingLocation ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default BinLocationsAdmin;