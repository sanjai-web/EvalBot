import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Calendar, FileText, Building2, Upload, Edit, Trash2, Mail, 
  Phone, User, Search, Filter, Eye, Ban, CheckCircle, Hash, X, Save, Plus, Clock,
  Star
} from 'lucide-react';

function AdminDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state?.collection;

  // Mock student data with blocked status
  const initialStudents = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', mobile: '+1 (555) 123-4567', overallScore: 85, isBlocked: false },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', mobile: '+1 (555) 987-6543', overallScore: 92, isBlocked: true },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', mobile: '+1 (555) 456-7890', overallScore: 78, isBlocked: false },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', mobile: '+1 (555) 234-5678', overallScore: 88, isBlocked: false },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', mobile: '+1 (555) 876-5432', overallScore: 95, isBlocked: false },
  ];

  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCollection, setEditedCollection] = useState(collection);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddApplicant, setShowAddApplicant] = useState(false);
  const [newApplicant, setNewApplicant] = useState({
    name: '',
    email: '',
    mobile: '',
    overallScore: ''
  });

  // Level configuration
  const levelConfig = {
    'Beginner': { color: 'green', icon: '', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-200' },
    'Intermediate': { color: 'yellow', icon: '', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
    'Advanced': { color: 'red', icon: '', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-200' }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.mobile.includes(searchTerm)
  );

  // Format date with time for display
  const formatDisplayDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const [datePart, timePart] = dateTimeStr.split(' ');
    return (
      <div className="flex flex-col">
        <span className="font-medium">{datePart}</span>
        <span className="text-xs text-slate-500 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{timePart}</span>
        </span>
      </div>
    );
  };

  // Convert date string to datetime-local value
  const getDateTimeLocalValue = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Convert datetime-local value to formatted string
  const formatDateTimeFromInput = (datetimeLocalValue) => {
    if (!datetimeLocalValue) return '';
    const [datePart, timePart] = datetimeLocalValue.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // Toggle block status for a student
  const toggleBlockStudent = (studentId) => {
    setStudents(students.map(student =>
      student.id === studentId 
        ? { ...student, isBlocked: !student.isBlocked }
        : student
    ));
  };

  // Handle collection edit
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      // Here you would typically make an API call to update the collection
      console.log('Updated collection:', editedCollection);
    }
    setIsEditing(!isEditing);
  };

  // Handle input changes for collection editing
  const handleInputChange = (field, value) => {
    setEditedCollection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle date time change
  const handleDateTimeChange = (e) => {
    const formattedDateTime = formatDateTimeFromInput(e.target.value);
    setEditedCollection(prev => ({
      ...prev,
      date: formattedDateTime
    }));
  };

  // Handle collection deletion
  const handleDeleteCollection = () => {
    // Here you would typically make an API call to delete the collection
    console.log('Deleting collection:', collection.id);
    navigate('/');
  };

  // Handle new applicant form input changes
  const handleNewApplicantChange = (field, value) => {
    setNewApplicant(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding new applicant
  const handleAddApplicant = () => {
    if (newApplicant.name && newApplicant.email && newApplicant.mobile && newApplicant.overallScore) {
      const newStudent = {
        id: students.length + 1,
        name: newApplicant.name,
        email: newApplicant.email,
        mobile: newApplicant.mobile,
        overallScore: parseInt(newApplicant.overallScore),
        isBlocked: false
      };
      
      setStudents([...students, newStudent]);
      setNewApplicant({
        name: '',
        email: '',
        mobile: '',
        overallScore: ''
      });
      setShowAddApplicant(false);
      
      // Update the collection's applicant count
      setEditedCollection(prev => ({
        ...prev,
        applicants: prev.applicants + 1
      }));
    }
  };

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No Collection Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-lg">
              ADMIN
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="text-sm">Collections</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-medium text-slate-900">Details</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Collection Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedCollection.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={editedCollection.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="text-blue-700 font-medium bg-white border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{editedCollection.company}</h1>
                    <p className="text-blue-700 font-medium">{editedCollection.role}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  editedCollection.status === 'Active' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {editedCollection.status}
                </span>
                {isEditing ? (
                  <select
                    value={editedCollection.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className="px-3 py-1 rounded-full text-sm font-medium border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    levelConfig[editedCollection.level].bgColor
                  } ${levelConfig[editedCollection.level].textColor} ${
                    levelConfig[editedCollection.level].borderColor
                  }`}>
                    {levelConfig[editedCollection.level].icon} {editedCollection.level}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Interview ID */}
              <ColorDetailItem 
                icon={Hash} 
                label="Interview ID" 
                value={editedCollection.interviewId} 
                color="blue" 
              />
              
              {/* Date & Time */}
              <ColorDetailItem 
                icon={Calendar} 
                label="Created Date & Time" 
                value={
                  isEditing ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="datetime-local"
                          value={getDateTimeLocalValue(editedCollection.date)}
                          onChange={handleDateTimeChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Current: {editedCollection.date}
                      </p>
                    </div>
                  ) : (
                    formatDisplayDateTime(editedCollection.date)
                  )
                } 
                color="blue" 
              />
              
              <ColorDetailItem 
                icon={FileText} 
                label="Domain" 
                value={
                  isEditing ? (
                    <select
                      value={editedCollection.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Role Based">Role Based</option>
                    </select>
                  ) : (
                    editedCollection.domain
                  )
                } 
                color="indigo" 
              />
              
              <ColorDetailItem 
                icon={Building2} 
                label="Total Applicants" 
                value={editedCollection.applicants} 
                color="green" 
              />
              
              <ColorDetailItem 
                icon={Upload} 
                label="Uploaded File" 
                value={editedCollection.fileName} 
                color="purple" 
              />

              <ColorDetailItem 
                icon={Star} 
                label="Interview Level" 
                value={
                  isEditing ? (
                    <select
                      value={editedCollection.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      levelConfig[editedCollection.level].bgColor
                    } ${levelConfig[editedCollection.level].textColor} ${
                      levelConfig[editedCollection.level].borderColor
                    }`}>
                      {levelConfig[editedCollection.level].icon} {editedCollection.level}
                    </span>
                  )
                } 
                color="yellow" 
              />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Job Description</span>
              </h3>
              {isEditing ? (
                <textarea
                  value={editedCollection.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700 leading-relaxed text-sm bg-white"
                  rows={4}
                />
              ) : (
                <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {editedCollection.description}
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-6 mt-6">
              <div className="flex space-x-3">
                <button 
                  onClick={handleEditToggle}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{isEditing ? 'Save Changes' : 'Edit Collection'}</span>
                </button>
                
                {isEditing ? (
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedCollection(collection); // Reset changes
                    }}
                    className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student Details Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Applicant Details</span>
                </h2>
                <p className="text-slate-600 text-sm mt-1">List of all applicants for this position</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                {/* Add Applicant Button */}
                <button
                  onClick={() => setShowAddApplicant(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Applicant</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-900 text-sm group-hover:text-blue-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-700 text-sm">{student.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span className="text-slate-700 text-sm">{student.mobile}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.overallScore >= 90 ? 'bg-green-500' :
                              student.overallScore >= 80 ? 'bg-blue-500' :
                              student.overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.overallScore}%` }}
                          ></div>
                        </div>
                        <span className={`font-medium text-sm ${
                          student.overallScore >= 90 ? 'text-green-700' :
                          student.overallScore >= 80 ? 'text-blue-700' :
                          student.overallScore >= 70 ? 'text-yellow-700' : 'text-red-700'
                        }`}>
                          {student.overallScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.isBlocked 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {student.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors flex items-center space-x-1 shadow-sm">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => toggleBlockStudent(student.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 shadow-sm ${
                            student.isBlocked
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {student.isBlocked ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                          <span>{student.isBlocked ? 'Unblock' : 'Block'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Showing {filteredStudents.length} of {students.length} applicants
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-white hover:border-blue-300 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-white hover:border-blue-300 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Collection</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete the collection "{collection.company} - {collection.role}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCollection}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Applicant Modal */}
      {showAddApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-linear-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-semibold">Add New Applicant</h2>
              <button
                onClick={() => setShowAddApplicant(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newApplicant.name}
                  onChange={(e) => handleNewApplicantChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter applicant's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newApplicant.email}
                  onChange={(e) => handleNewApplicantChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={newApplicant.mobile}
                  onChange={(e) => handleNewApplicantChange('mobile', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Overall Score *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newApplicant.overallScore}
                  onChange={(e) => handleNewApplicantChange('overallScore', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter score (0-100)"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowAddApplicant(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddApplicant}
                  disabled={!newApplicant.name || !newApplicant.email || !newApplicant.mobile || !newApplicant.overallScore}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-green-500/30"
                >
                  Add Applicant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Color Detail Item Component
function ColorDetailItem({ icon: Icon, label, value, color = "blue" }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-600 mb-1">{label}</p>
        <div className="text-sm font-semibold text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}

export default AdminDetails;